/**
 * 图片优化和懒加载模块
 * 
 * 功能：
 * 1. 自动将PNG图片替换为WebP格式（节省94%流量）
 * 2. 实现懒加载（只加载可见图片）
 * 3. 添加加载占位符和动画
 * 4. 自动降级到PNG（如果WebP不支持）
 */

// 检测浏览器是否支持WebP
let supportsWebP = false;

(function checkWebPSupport() {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
        // 检测WebP支持
        supportsWebP = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        console.log(supportsWebP ? '✅ 浏览器支持WebP格式' : '⚠️ 浏览器不支持WebP，将使用PNG格式');
    }
})();

/**
 * 获取优化后的图片路径
 * @param {string} originalPath - 原始图片路径（PNG）
 * @returns {string} - 优化后的图片路径（WebP或PNG）
 */
function getOptimizedImagePath(originalPath) {
    if (!originalPath) return originalPath;
    
    // 如果浏览器支持WebP，替换为.webp
    if (supportsWebP && originalPath.endsWith('.png')) {
        return originalPath.replace('.png', '.webp');
    }
    
    return originalPath;
}

/**
 * 创建带占位符的图片元素
 * @param {string} src - 图片源路径
 * @param {string} alt - 图片alt文本
 * @param {object} styles - 图片样式
 * @returns {HTMLImageElement} - 图片元素
 */
function createOptimizedImage(src, alt = '', styles = {}) {
    const img = document.createElement('img');
    
    // 优化图片路径
    const optimizedSrc = getOptimizedImagePath(src);
    
    // 设置data-src用于懒加载
    img.setAttribute('data-src', optimizedSrc);
    img.alt = alt;
    
    // 添加占位符（1x1透明像素）
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    
    // 添加loading类用于CSS动画
    img.classList.add('lazy-loading');
    
    // 应用样式
    Object.assign(img.style, styles);
    
    // 错误处理：如果WebP加载失败，降级到PNG
    img.onerror = function() {
        if (this.src.endsWith('.webp')) {
            console.warn('⚠️ WebP加载失败，降级到PNG:', this.src);
            this.src = this.src.replace('.webp', '.png');
        } else if (this.getAttribute('data-src').endsWith('.webp')) {
            console.warn('⚠️ WebP加载失败，降级到PNG:', this.getAttribute('data-src'));
            this.setAttribute('data-src', this.getAttribute('data-src').replace('.webp', '.png'));
        } else {
            // 最终降级：使用默认图片
            console.error('❌ 图片加载失败，使用默认图片');
            this.src = 'images/miners/1.png';
        }
    };
    
    return img;
}

/**
 * 懒加载观察器
 */
let lazyLoadObserver = null;

function initLazyLoad() {
    // 如果浏览器不支持IntersectionObserver，直接加载所有图片
    if (!('IntersectionObserver' in window)) {
        console.warn('⚠️ 浏览器不支持IntersectionObserver，直接加载所有图片');
        loadAllImages();
        return;
    }
    
    // 创建观察器
    lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.01
    });
    
    // 观察所有懒加载图片
    observeLazyImages();
    
    console.log('✅ 图片懒加载已初始化');
}

/**
 * 观察所有懒加载图片
 */
function observeLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        if (lazyLoadObserver) {
            lazyLoadObserver.observe(img);
        }
    });
}

/**
 * 加载单个图片
 * @param {HTMLImageElement} img - 图片元素
 */
function loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    
    // 创建新图片对象预加载
    const tempImg = new Image();
    
    tempImg.onload = function() {
        img.src = src;
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
        img.removeAttribute('data-src');
        console.log('✅ 图片加载成功:', src);
    };
    
    tempImg.onerror = function() {
        console.error('❌ 图片加载失败:', src);
        // 尝试降级到PNG
        if (src.endsWith('.webp')) {
            const pngSrc = src.replace('.webp', '.png');
            console.log('🔄 尝试加载PNG版本:', pngSrc);
            img.src = pngSrc;
        } else {
            // 使用默认图片
            img.src = 'images/miners/1.png';
        }
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-error');
    };
    
    tempImg.src = src;
}

/**
 * 直接加载所有图片（不支持IntersectionObserver时使用）
 */
function loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => loadImage(img));
}

/**
 * 优化现有图片元素
 * 将页面上已有的图片元素转换为懒加载
 */
function optimizeExistingImages() {
    const images = document.querySelectorAll('img[src*="images/miners"]');
    
    images.forEach(img => {
        const currentSrc = img.src || img.getAttribute('src');
        if (!currentSrc || img.hasAttribute('data-src')) return;
        
        // 优化图片路径
        const optimizedSrc = getOptimizedImagePath(currentSrc);
        
        // 如果路径改变了（PNG → WebP）
        if (optimizedSrc !== currentSrc) {
            // 保存原始src作为data-src
            img.setAttribute('data-src', optimizedSrc);
            
            // 设置占位符
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            
            // 添加懒加载类
            img.classList.add('lazy-loading');
            
            // 添加到观察器
            if (lazyLoadObserver) {
                lazyLoadObserver.observe(img);
            } else {
                // 如果观察器未初始化，直接加载
                loadImage(img);
            }
        }
    });
    
    console.log(`✅ 已优化 ${images.length} 个图片元素`);
}

/**
 * 添加CSS样式
 */
function addLazyLoadStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 懒加载图片样式 */
        img.lazy-loading {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading-shimmer 1.5s infinite;
        }
        
        img.lazy-loaded {
            opacity: 1;
        }
        
        img.lazy-error {
            opacity: 0.5;
            filter: grayscale(100%);
        }
        
        @keyframes loading-shimmer {
            0% {
                background-position: 200% 0;
            }
            100% {
                background-position: -200% 0;
            }
        }
        
        /* 深色主题下的占位符 */
        @media (prefers-color-scheme: dark) {
            img.lazy-loading {
                background: linear-gradient(90deg, #2a2a2a 25%, #1a1a1a 50%, #2a2a2a 75%);
                background-size: 200% 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * 初始化图片优化器
 */
function initImageOptimizer() {
    console.log('🚀 初始化图片优化器...');
    
    // 添加CSS样式
    addLazyLoadStyles();
    
    // 初始化懒加载
    initLazyLoad();
    
    // 优化现有图片
    optimizeExistingImages();
    
    // 监听DOM变化，自动优化新添加的图片
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // 元素节点
                    // 检查是否是图片
                    if (node.tagName === 'IMG' && node.src && node.src.includes('images/miners')) {
                        const optimizedSrc = getOptimizedImagePath(node.src);
                        if (optimizedSrc !== node.src) {
                            node.setAttribute('data-src', optimizedSrc);
                            node.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                            node.classList.add('lazy-loading');
                            if (lazyLoadObserver) {
                                lazyLoadObserver.observe(node);
                            }
                        }
                    }
                    // 检查子元素中的图片
                    const imgs = node.querySelectorAll && node.querySelectorAll('img[src*="images/miners"]');
                    if (imgs && imgs.length > 0) {
                        imgs.forEach(img => {
                            const optimizedSrc = getOptimizedImagePath(img.src);
                            if (optimizedSrc !== img.src && !img.hasAttribute('data-src')) {
                                img.setAttribute('data-src', optimizedSrc);
                                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                                img.classList.add('lazy-loading');
                                if (lazyLoadObserver) {
                                    lazyLoadObserver.observe(img);
                                }
                            }
                        });
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ 图片优化器初始化完成');
    console.log(`📊 WebP支持: ${supportsWebP ? '是' : '否'}`);
    console.log(`📊 预计节省流量: ${supportsWebP ? '94%' : '0%'}`);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageOptimizer);
} else {
    initImageOptimizer();
}

// 导出函数供其他模块使用
window.imageOptimizer = {
    getOptimizedImagePath,
    createOptimizedImage,
    loadImage,
    observeLazyImages,
    supportsWebP
};

console.log('✅ 图片优化模块已加载');

