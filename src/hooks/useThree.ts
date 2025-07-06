import { ref, toRaw } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export interface ModelItem {
  id: string
  modelUrl: string
  title: string
  bg: string
  cameraPosition: { x: number; y: number; z: number }
  modePosition: { x: number; y: number; z: number }
  modeScale: { x: number; y: number; z: number }
  cameraNear?: number
  cameraFar?: number
}

interface UseThreeOptions {
  containerId: string
  onModelLoaded?: (model: THREE.Group) => void
  onError?: (error: any) => void
}

export function useThree(options: UseThreeOptions) {
  const scene = ref<THREE.Scene | null>(null)
  const camera = ref<THREE.PerspectiveCamera | null>(null)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  const controls = ref<OrbitControls | null>(null)
  const anId = ref<number | null>(null)
  const loading = ref<boolean>(false)
  const directionalLight = ref<THREE.DirectionalLight | null>(null)

  let currentModel: THREE.Group | null = null
  let currentPanorama: THREE.Mesh | null = null

  function init(data: ModelItem) {
    const container = document.getElementById(options.containerId)
    if (!container || scene.value) return

    // 初始化场景
    scene.value = new THREE.Scene()

    // 初始化相机
    const width = window.innerWidth
    const height = window.innerHeight
    const near = data.cameraNear ?? 0.01
    const far = data.cameraFar ?? 1000
    camera.value = new THREE.PerspectiveCamera(75, width / height, near, far)
    camera.value.position.set(
      data.cameraPosition.x,
      data.cameraPosition.y,
      data.cameraPosition.z
    )
    camera.value.lookAt(0, 0, 0)

    // 初始化渲染器
    renderer.value = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.value.domElement)

    // 光源
    createLight()

    // 全景背景
    // updatePanorama(data.bg)

    // 控制器
    if (camera.value && renderer.value) {
      controls.value = new OrbitControls(camera.value, renderer.value.domElement)
      // 鼠标缩放
      controls.value.enableZoom = true
      // 自动旋转
      controls.value.autoRotate = true
      // 滑动阻尼
      controls.value.enableDamping = true
      // 自转速度
      controls.value.autoRotateSpeed = 1
    }

    // 加载模型
    // updateModel(data)

    // 动画循环
    renderAnimate()

    // 监听窗口变化
    window.addEventListener('resize', onWindowResize)
  }

  function createLight() {
    // 环境光 - 提供基础照明
    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.value?.add(ambientLight)

    // 平行光 - 模拟太阳光
    directionalLight.value = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.value.position.set(5, 10, 7.5)
    scene.value?.add(directionalLight.value)

    // 添加一个辅助光源（背面补光）
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3)
    backLight.position.set(-5, -10, -7.5)
    scene.value?.add(backLight)
  }

  function updatePanorama(img: string) {
    if (currentPanorama) {
      scene.value?.remove(currentPanorama)
      currentPanorama.geometry.dispose()
      currentPanorama.material.map?.dispose()
      currentPanorama.material.dispose()
      currentPanorama = null
    }

    const geometry = new THREE.SphereGeometry(500, 100, 100)
    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(img),
      side: THREE.BackSide
    })

    currentPanorama = new THREE.Mesh(geometry, material)
    scene.value?.add(currentPanorama)
  }

  // 创建立方体全景
  function updateCubePanorama(urls: string[]) {
    if (currentPanorama) {
      scene.value?.remove(currentPanorama)
      currentPanorama.geometry.dispose()
      currentPanorama = null
    }
    if (controls.value) {
      controls.value.reset();
    }
    const loader = new THREE.TextureLoader()
    const promises = urls.map(url => {
      return new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(url, resolve, undefined, reject)
      })
    })

    Promise.all(promises).then(textures => {
      const materials = textures.map((texture, index) => {
        if (index === 2 || index === 3) {
          texture.center.set(0.5, 0.5)
          texture.rotation = Math.PI
        }
        return new THREE.MeshBasicMaterial({
          map: texture,
          // side: THREE.BackSide
        })
      })
      const geometry = new THREE.BoxGeometry(10, 10, 10)
      geometry.scale(1, 1, -1)
      currentPanorama = new THREE.Mesh(geometry, materials)
      scene.value?.add(currentPanorama)

      // 添加滚轮缩放限制
      if (controls.value) {
        controls.value.minDistance = 0.1
        controls.value.maxDistance = 3
        controls.value.enablePan = false // 禁止平移拖出视角
      }
    }).catch(err => {
      console.error('贴图加载失败:', err)
    })
  }

  function updateCamera(data: ModelItem) {
    if (!camera.value) return

    camera.value.position.set(
      data.cameraPosition.x,
      data.cameraPosition.y,
      data.cameraPosition.z
    )
    camera.value.lookAt(0, 0, 0)
  }

  function updateModel(data: ModelItem) {
    loading.value = true

    if (currentModel) {
      scene.value?.remove(currentModel)
      currentModel = null
    }

    const loader = new GLTFLoader()
    loader.load(
      data.modelUrl,
      gltf => {
        gltf.scene.position.set(data.modePosition.x, data.modePosition.y, data.modePosition.z)
        gltf.scene.scale.set(data.modeScale.x, data.modeScale.y, data.modeScale.z)
        scene.value?.add(gltf.scene)
        currentModel = gltf.scene
        options.onModelLoaded?.(gltf.scene)
        loading.value = false
      },
      undefined,
      error => {
        console.error('模型加载失败:', error)
        options.onError?.(error)
        loading.value = false
      }
    )
  }

  function renderAnimate() {
    anId.value = requestAnimationFrame(renderAnimate)
    if (controls.value) controls.value.update()
    // 让光源跟随相机移动
    if (directionalLight.value && camera.value) {
      directionalLight.value.position.copy(camera.value.position)
    }

    if (renderer.value && camera.value && scene.value) {
      // renderer.value.render(scene.value, camera.value)
      const rawCamera = toRaw(camera.value)
      const rawScene = toRaw(scene.value)
      renderer.value.render(rawScene, rawCamera)
    }
  }

  function onWindowResize() {
    if (camera.value && renderer.value) {
      camera.value.aspect = window.innerWidth / window.innerHeight
      camera.value.updateProjectionMatrix()
      renderer.value.setSize(window.innerWidth, window.innerHeight)
    }
  }

  function destroy() {
    if (anId.value) cancelAnimationFrame(anId.value)
    if (renderer.value) {
      renderer.value.forceContextLoss()
      renderer.value.dispose()
    }
    if (scene.value) scene.value.clear()
    if (controls.value) {
      controls.value.dispose()
    }
    const container = document.getElementById(options.containerId)
    if (container) container.innerHTML = ''
    scene.value = null
    camera.value = null
    renderer.value = null
    controls.value = null
  }

  return {
    init,
    updateModel,
    updatePanorama,
    updateCubePanorama,
    updateCamera,
    destroy,
    loading
  }
}
