// 显示当前日期
const now = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('date').textContent = now.toLocaleDateString('zh-CN', options);

// 版权年份
const yearElement = document.querySelector('.copyright');
yearElement.textContent = `© ${new Date().getFullYear()}`;

// 添加鼠标移动视差效果
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    const container = document.querySelector('.container');
    container.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
});
