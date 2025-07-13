/**
* @author Lcs
* @date 2025-07-12 18:18:13
* @description three工具类
*/
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Vector3 } from 'three'
import * as TWEEN from '@tweenjs/tween.js';

export default class PanoramaViewer {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private controls: OrbitControls | null = null;
  private container: HTMLElement;
  private animationId: number | null = null; // 动画请求 ID
  private tweenGroup: TWEEN.Group;

  constructor(container: HTMLElement) {
    this.container = container;
    this.tweenGroup = new TWEEN.Group(); // 创建 Tween 组

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.setupResizeEvent();
    this.animate();
  }

  // 初始化场景
  private initScene() {
    this.scene = new THREE.Scene();
  }

  // 初始化相机
  private initCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 2);
    this.scene!.add(this.camera);
  }

  // 初始化渲染器
  private initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
  }

  // 初始化轨道控制器
  private initControls() {
    this.controls = new OrbitControls(this.camera as THREE.PerspectiveCamera, this.renderer!.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.maxDistance = 12;
    this.controls.minPolarAngle = Math.PI / 2;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.dampingFactor = 0.1; // 更细腻的阻尼效果
    // this.controls.autoRotate = true;
    // this.controls.autoRotateSpeed = 2;
  }

  // 添加环境球面贴图
  public loadPanorama(name: string, position: Vector3, url: string) {
    const loader = new THREE.TextureLoader();
    loader.load(url, (texture) => {
      const geometry = new THREE.SphereGeometry(16, 256, 256);
      geometry.scale(1, 1, -1);

      const material = new THREE.MeshBasicMaterial({
        map: texture
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = name;
      mesh.position.set(position.x, position.y, position.z);
      mesh.rotation.y = Math.PI / 2;
      this.scene!.add(mesh);
      return mesh;
    }, undefined, (error) => {
      console.error('全景图加载失败:', error);
    });
  }

  // 渲染函数
  public render() {
    this.renderer!.render(this.scene as THREE.Scene, this.camera as THREE.PerspectiveCamera);
  }

  private animate() {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.animationId = requestAnimationFrame(() => this.animate());
    this.tweenGroup.update(); // ✅ 使用 tweenGroup 更新所有动画
    this.controls?.update(); // 仅当 autoRotate 启用时有效
    this.render();
  }

  public stopAnimation() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private handleResize = () => {
    if (!this.camera || !this.renderer) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.render();
  };

  // 调整窗口大小时更新相机和渲染器
  private setupResizeEvent() {
    window.addEventListener('resize', this.handleResize);
  }
  public destroy() {
    // 移除 resize 监听
    window.removeEventListener('resize', this.handleResize);
    this.stopAnimation();

    // 清空场景中的所有对象
    this.scene!.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        } else if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        }
      }
    });

    this.scene!.clear();

    // 移除 DOM 中的渲染器元素
    if (this.renderer!.domElement && this.renderer!.domElement.parentNode) {
      this.renderer!.domElement.parentNode.removeChild(this.renderer!.domElement);
    }

    // 释放渲染器
    this.renderer!.dispose();

    // 重置引用（可选）
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
  }

  // 更新相机位置
  public updateCameraPosition(x: number, y: number, z: number) {
    this.camera!.position.set(x, y, z);
    this.render();
  }

  // 漫游动画方法
  public startRoaming(startPosition: Vector3, endPosition: Vector3, lookAtTarget: Vector3, duration: number = 1000, onComplete?: () => void) {
    // 禁用控制器交互
    this.controls!.enabled = false;
    // 创建一个虚拟对象用于 tween 控制
    new TWEEN.Tween(startPosition, this.tweenGroup)
      .to(endPosition, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.camera!.position.copy(startPosition);
        this.camera!.lookAt(lookAtTarget);
        this.controls!.target.copy(startPosition);
        this.controls!.update();
      })
      .onComplete(() => {
        this.controls!.enabled = true;
        // this.controls!.target.copy(lookAtTarget);
        this.controls!.update();
        if (onComplete) onComplete();
      })
      .start();
  }

  // 切换到指定房间
  public switchToRoom(roomName: string) {
    let targetMesh: THREE.Mesh | null = null;
    this.scene!.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === roomName) {
        targetMesh = child;
      }
    });

    if (targetMesh) {
      // 移动相机到目标房间中心
      // this.camera!.position.copy(targetMesh.position);

      // this.camera!.position.set(0, 0, 2);
      // this.camera!.lookAt(targetMesh.position); // 相机朝向目标点
      // this.controls!.target.set(targetMesh.position.x, targetMesh.position.y, targetMesh.position.z);
      // this.controls!.update();
      // this.render();
      const center = (targetMesh as THREE.Mesh).position.clone();
      const offset = new THREE.Vector3(0, 0, 2);
      const cameraPosition = center.clone().add(offset);

      this.startRoaming(
        this.camera!.position.clone(),
        cameraPosition,
        center,
        1000,
        () => {
          console.log('切换完成');
        })
    }
  }

  // 切换全景图
  public switchToPanorama(name: string) {
    this.scene!.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.name !== name) {
        console.log('🚀🚀🚀 ~method:  -----', child)
        this.scene!.remove(child);
        child.geometry.dispose();
        if (child.material.map) child.material.map.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    });
  }

  // 获取当前相机对象（供外部控制）
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera as THREE.PerspectiveCamera;
  }

  // 获取控制器（可启用/禁用自动旋转等）
  public getControls(): OrbitControls {
    return this.controls as OrbitControls;
  }
}
