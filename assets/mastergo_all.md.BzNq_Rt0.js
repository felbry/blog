import{_ as e,c as a,o,a1 as t}from"./chunks/framework.Cq9cuCmX.js";const u=JSON.parse('{"title":"Master Go","description":"","frontmatter":{},"headers":[],"relativePath":"mastergo/all.md","filePath":"mastergo/all.md","lastUpdated":1724664726000}'),l={name:"mastergo/all.md"},r=t('<h1 id="master-go" tabindex="-1">Master Go <a class="header-anchor" href="#master-go" aria-label="Permalink to &quot;Master Go&quot;">​</a></h1><h2 id="快捷键" tabindex="-1">快捷键 <a class="header-anchor" href="#快捷键" aria-label="Permalink to &quot;快捷键&quot;">​</a></h2><p>一次性选中多个元素 <code>Shift + 鼠标左键点击多个元素</code></p><p>新建文本 <code>T</code></p><p>创建容器 <code>F</code> 快速创建 100*100 的容器 <code>R</code></p><p>创建自动布局(容器) <code>Shift + A</code></p><p>编组 <code>Command + G</code> （感觉有了自动布局(容器)后，编组有些多余。组的好处是 在页面上会显示组标题。容器与组的区别：1是容器中图层可以通过拖动移入和移出，而组是逃不出去的；2是容器大小可以单独设置，和子元素宽高是独立的，超出也能设置裁剪隐藏，而组是根据内部元素自动调整，同理调整组的大小也会反向调整组内元素大小）</p><p>创建组件 <code>Option + Command + K</code></p><p>直接选中一个元素 <code>Command + Ctrl + 鼠标左键</code>（一般鼠标点击某个元素，会选中这个组或容器；可以先按下前两个键，鼠标再点击想要选中的元素）</p><p>快速复制一组元素 <code>Command + D</code> 或 <code>Option + 鼠标左键拖</code></p><h2 id="创建形状" tabindex="-1">创建形状 <a class="header-anchor" href="#创建形状" aria-label="Permalink to &quot;创建形状&quot;">​</a></h2><p><code>R</code> 创建矩形 <code>R + Shift</code> 创建正方形</p><p><code>O</code> 创建椭圆形 <code>O + Shift</code> 创建圆形</p><p><code>L</code> 创建直线</p><p>三角形和星形通过选中顶部工具栏使用，也可以按住<code>Shift</code>保持比例不变</p><h2 id="组件与实例" tabindex="-1">组件与实例 <a class="header-anchor" href="#组件与实例" aria-label="Permalink to &quot;组件与实例&quot;">​</a></h2><p>实心菱形（一个大点）为组件、空心菱形为实例、实心菱形（四个小点）为可变/组合组件</p><p>可以创建一个容器，将多个组件放置其中，比如起名叫图标库/组件库。之后拖动任意一个组件到页面上，就可以点击这个组件在右侧面板随意切换该容器下的任意组件。 - 每日跟练第一期第 3 天</p><p>也可以创建一个组件的多个状态，每个起名规范叫“组件名/属性 1 值/属性 2 值”，比如“MenuItem/展开/否”，“MenuItem/展开/是”，“MenuItem/收起/否”，属性 1 表示状态，有展开、收起、移上、禁用等值；属性 2 表示是否展示图标。然后选中全部组件，在右侧选择“组合为组件状态”，它们就组合成一个整体了。此时任意一个实例都可以自由切换了。 - 每日跟练第一期第 4 天</p><h2 id="全局的颜色样式和文字样式" tabindex="-1">全局的颜色样式和文字样式 <a class="header-anchor" href="#全局的颜色样式和文字样式" aria-label="Permalink to &quot;全局的颜色样式和文字样式&quot;">​</a></h2><p>每日跟练第一期第 5 天</p><p>通过创建容器 -&gt; 填充 -&gt; 四个点 -&gt; 创建样式 可以基于当前颜色创建一个主题色</p><p>通过选中文本 -&gt; 文字 -&gt; 四个点 -&gt; 创建样式 可以基于当前 font-family、weight、size、line-height、字间距创建一个文本样式</p><h2 id="自动布局-容器" tabindex="-1"><a href="https://mastergo.com/help/layer/auto-layout" target="_blank" rel="noreferrer">自动布局</a>（容器） <a class="header-anchor" href="#自动布局-容器" aria-label="Permalink to &quot;[自动布局](https://mastergo.com/help/layer/auto-layout)（容器）&quot;">​</a></h2><p>自动布局其实就是“容器”加了“自动布局”属性，类似于 flex 容器。</p><p>很多场景都可以创建这个特殊容器</p><ul><li>选择几个元素 shift+a</li><li>已有容器 添加 自动布局属性（设置了 display: flex）</li><li>...</li></ul><p>方向：水平、垂直（flex-direction）、换行（flex-wrap）</p><p>间距：gap（鼠标悬停在间距区域，单击，可以输入值调整）</p><p>边距：px、py</p><p>定位：flex 下的容器位置是根据 flex 相关属性排列的，如果要随意调整子元素位置，将子元素<strong>设置成绝对定位</strong></p><h2 id="创建元素" tabindex="-1">创建元素 <a class="header-anchor" href="#创建元素" aria-label="Permalink to &quot;创建元素&quot;">​</a></h2><ul><li>文本</li><li>icon 左侧面板-资源-组件/图标</li></ul>',33),d=[r];function p(c,i,n,h,s,m){return o(),a("div",null,d)}const _=e(l,[["render",p]]);export{u as __pageData,_ as default};
