import{_ as i,c as a,a4 as t,o as e}from"./chunks/framework.07rp2gkU.js";const c=JSON.parse('{"title":"微信小程序开发手册","description":"","frontmatter":{},"headers":[],"relativePath":"miniprogram/dev-handbook.md","filePath":"miniprogram/dev-handbook.md","lastUpdated":1732867126000}'),n={name:"miniprogram/dev-handbook.md"};function l(h,s,p,k,o,r){return e(),a("div",null,s[0]||(s[0]=[t(`<h1 id="微信小程序开发手册" tabindex="-1">微信小程序开发手册 <a class="header-anchor" href="#微信小程序开发手册" aria-label="Permalink to &quot;微信小程序开发手册&quot;">​</a></h1><h2 id="原生起步" tabindex="-1">原生起步 <a class="header-anchor" href="#原生起步" aria-label="Permalink to &quot;原生起步&quot;">​</a></h2><h3 id="unocss" tabindex="-1">UnoCSS <a class="header-anchor" href="#unocss" aria-label="Permalink to &quot;UnoCSS&quot;">​</a></h3><p>按照<a href="https://github.com/MellowCo/unocss-wechat/blob/main/readme.zh-CN.md" target="_blank" rel="noreferrer">教程</a>快速配置</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>有时需要在某个页面下创建<code>components</code>文件夹存放页面组件，教程的 glob pattern 匹配不到该文件夹下的 wxml 文件，需要更改下：<code>unocss pages/**/{*.wxml,components/*.wxml} -c unocss.config.js --watch -o unocss.wxss</code></p></div><p>生成全新的 unocss.wxss 文件比较简单，但原生小程序没有编译过程，导致 wxml 写的 class 是什么就是什么，比如 <code>class=&quot;bg-[red]&quot;</code>，unocss 生成的类名为<code>.bg-_lfl_red_lfr_</code>，而 wxml 中的类名没有变化，自然就匹配不上了</p><p>因此要解决这个问题，<strong>方案一</strong>就是按教程中的配置<code>transformer</code>，去改变 wxml 中的类名。它的弊端也很明显，把原来可读性高的类名改成编译后的了，增加了维护成本</p><p><strong>方案二</strong>就是在 wxml 中写类名时，尽量考虑可读性高的替代方案：</p><ul><li><p>用<code>hex</code>替代<code>#</code>；用<code>_</code>替代<code>:</code>、<code>/</code></p><p><code>bg-#81ecec/50</code>替代为<code>bg-hex-81ecec_50</code></p></li><li><p>针对<code>hover:</code>和<code>active:</code>，设置<code>separators</code>分隔符（教程中使用的是<code>__</code>）</p><p>因此<code>hover:bg-red-500</code>替代为<code>hover__bg-red-500</code></p></li></ul><h3 id="页面路径配置和跳转" tabindex="-1">页面路径配置和跳转 <a class="header-anchor" href="#页面路径配置和跳转" aria-label="Permalink to &quot;页面路径配置和跳转&quot;">​</a></h3><p><strong>配置</strong></p><p>在<code>app.json</code>中配置<code>pages</code>和<code>tabBar.list</code>字段时，路径为相对路径，比如下边两种形式都是合法的：</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;pages&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;pages/index/index&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;home/home&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>可以理解为相对<code>app.json</code>的位置有<code>pages</code>和<code>home</code>文件夹，<code>pages</code>下还有<code>index</code>文件夹，其下有个<code>index</code>文件；同理<code>home</code>文件夹下有个<code>home</code>文件（可以理解为：无论是页面还是组件，引用时都要具体到其 js/json 文件，省略后缀）</p><p><strong>跳转</strong></p><p>无论是<code>switchTab</code>还是<code>navigateTo</code>这类导航，<code>url</code>可以是相对的也可以是绝对的</p><p>建议统一为绝对路径，以上述为例，假如你要跳转<code>index</code>页面，<code>wx.switchTab({ url: &#39;pages/index/index&#39; })</code>是错误的，因为没有<code>/</code>开头代表的是相对路径</p><h3 id="开发页面" tabindex="-1">开发页面 <a class="header-anchor" href="#开发页面" aria-label="Permalink to &quot;开发页面&quot;">​</a></h3><p>页面/组件统一用 Component 构建，页面生命周期函数放在<code>methods</code>中 <sup class="footnote-ref"><a href="#footnote1">[1]</a><a class="footnote-anchor" id="footnote-ref1"></a></sup></p><p>此时页面 json 文件要包含<code>usingComponents</code>定义，可以为<code>{}</code> <sup class="footnote-ref"><a href="#footnote2">[2]</a><a class="footnote-anchor" id="footnote-ref2"></a></sup>（如果不定义这个字段，会使得页面的 this 对象的原型稍有差异 <sup class="footnote-ref"><a href="#footnote3">[3]</a><a class="footnote-anchor" id="footnote-ref3"></a></sup>）</p><p><code>Component</code>的<code>properties</code>可用来接收页面传参，如<code>/pages/index/index?paramA=123&amp;paramB=xyz</code>，<code>paramA</code>和<code>paramB</code>可通过<code>properties</code>获取到 <sup class="footnote-ref"><a href="#footnote2">[2:1]</a><a class="footnote-anchor" id="footnote-ref2:1"></a></sup></p><p><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page-life-cycle.html" target="_blank" rel="noreferrer">页面生命周期</a>：<code>onLoad</code> -&gt; <code>onShow</code> -&gt; <code>onReady</code>，之后可能触发<code>onHide</code>、<code>onUnload</code></p><h3 id="开发组件" tabindex="-1"><a href="https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html" target="_blank" rel="noreferrer">开发组件</a> <a class="header-anchor" href="#开发组件" aria-label="Permalink to &quot;[开发组件](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html)&quot;">​</a></h3><p>起步仨文件，<code>json</code>中声明<code>{ &quot;component&quot;: true }</code>，并且样式隔离设置成“页面影响组件，组件不影响页面”：<code>{ &quot;styleIsolation&quot;: &quot;apply-shared&quot; }</code> <sup class="footnote-ref"><a href="#footnote4">[4]</a><a class="footnote-anchor" id="footnote-ref4"></a></sup></p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-OIznW" id="tab-gInqGke" checked><label data-title="comp.js" for="tab-gInqGke">comp.js</label><input type="radio" name="group-OIznW" id="tab-TmhkCqQ"><label data-title="comp.json" for="tab-TmhkCqQ">comp.json</label><input type="radio" name="group-OIznW" id="tab-z1S38Tn"><label data-title="comp.wxml" for="tab-z1S38Tn">comp.wxml</label></div><div class="blocks"><div class="language-js vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Component</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  data: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    msg: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;hello&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 组件生命周期</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  created</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {}, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 在组件实例刚刚被创建时执行，注意此时不能调用 setData</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  attached</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {}, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 在组件实例进入页面节点树时执行</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  ready</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {}, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 在组件布局完成后执行</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  moved</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {}, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 在组件实例被移动到节点树另一个位置时执行</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  detached</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {}, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 在组件实例被从页面节点树移除时执行</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 纯数据字段，就是不加监听器，可以通过this.setData修改，但感觉没必要，可以直接this.data.xxx = xxx</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  options: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    pureDataPattern:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">^</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;">_</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 指定所有 _ 开头的数据字段为纯数据字段</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  data: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    _a: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;xxx&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;component&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;styleIsolation&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;apply-shared&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">view</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bg-red-100&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; {{ msg }}, world &lt;/</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">view</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div></div></div><h3 id="wxml-语法" tabindex="-1"><a href="https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/" target="_blank" rel="noreferrer">WXML 语法</a> <a class="header-anchor" href="#wxml-语法" aria-label="Permalink to &quot;[WXML 语法](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/)&quot;">​</a></h3><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- boolean --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">view</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> checked</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;{{ false }}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">view</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">view</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> checked</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">view</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 绑定事件 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">view</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> bindtap</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;onTap&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">view</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- for --&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 默认就是index、item，显式指定一般用于嵌套 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">view</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  wx:for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;{{ array }}&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  wx:key</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;index&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  wx:for-index</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;index&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  wx:for-item</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;item&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  {{ index }}: {{ item.message }}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">view</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h2 id="全屏页面" tabindex="-1">全屏页面 <a class="header-anchor" href="#全屏页面" aria-label="Permalink to &quot;全屏页面&quot;">​</a></h2><p>通过<a href="https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html" target="_blank" rel="noreferrer">页面配置</a>设置<code>navigationStyle</code>为<code>custom</code></p><p><img src="https://felbry.github.io/picx-images-hosting/image.73tz83aaq3.webp" alt="image"></p><ul><li>黄色：状态栏高度</li><li>绿色：胶囊距离顶部高度</li><li>蓝色：胶囊高度</li><li>灰色：导航栏高度</li></ul><p>状态栏高度（黄色）可以通过<code>wx.getWindowInfo().statusBarHeight</code>获取（<a href="https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getWindowInfo.html" target="_blank" rel="noreferrer">API -&gt; 基础 -&gt; wx.getWindowInfo</a>）</p><p>胶囊高度（蓝色）和距离顶部高度（绿色）可以通过<code>wx.getMenuButtonBoundingClientRect()</code>的<code>height</code>和<code>top</code>获取（<a href="https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html" target="_blank" rel="noreferrer">API -&gt; 界面 -&gt; wx.getMenuButtonBoundingClientRect</a>）</p><p>最终得出：导航栏高度（灰色）= (绿色 - 黄色) * 2 + 蓝色</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">statusBarHeight</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> wx.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getWindowInfo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">top</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> wx.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getMenuButtonBoundingClientRect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> navBarHeight</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (top </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> statusBarHeight) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> height</span></span></code></pre></div><h3 id="应用" tabindex="-1">应用 <a class="header-anchor" href="#应用" aria-label="Permalink to &quot;应用&quot;">​</a></h3><p>在<code>Taro</code>中，直接注册到全局</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-OQvvs" id="tab-G7NUK6f" checked><label data-title="app.js" for="tab-G7NUK6f">app.js</label><input type="radio" name="group-OQvvs" id="tab-UYvgQeM"><label data-title="page.vue" for="tab-UYvgQeM">page.vue</label></div><div class="blocks"><div class="language-js vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Taro </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@tarojs/taro&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { setGlobalDataPlugin } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@tarojs/taro&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> app</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> createApp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> })</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">statusBarHeight</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Taro.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getWindowInfo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">top</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Taro.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getMenuButtonBoundingClientRect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">app.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(setGlobalDataPlugin, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  statusBarHeight,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  navBarHeight: (top </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> statusBarHeight) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> height,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Taro </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@tarojs/taro&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">statusBarHeight</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">navBarHeight</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Taro.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getApp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div></div></div><h2 id="参考链接" tabindex="-1">参考链接 <a class="header-anchor" href="#参考链接" aria-label="Permalink to &quot;参考链接&quot;">​</a></h2><hr class="footnotes-sep"><section class="footnotes"><ol class="footnotes-list"><li id="footnote1" class="footnote-item"><p><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html" target="_blank" rel="noreferrer">指南 -&gt; 小程序框架 -&gt; 注册页面 -&gt; #使用 Component 构造器构造页面</a> <a href="#footnote-ref1" class="footnote-backref">↩︎</a></p></li><li id="footnote2" class="footnote-item"><p><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html" target="_blank" rel="noreferrer">指南 -&gt; 自定义组件 -&gt; Component 构造器 -&gt; #使用 Component 构造器构造页面</a> <a href="#footnote-ref2" class="footnote-backref">↩︎</a> <a href="#footnote-ref2:1" class="footnote-backref">↩︎</a></p></li><li id="footnote3" class="footnote-item"><p><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/" target="_blank" rel="noreferrer">指南 -&gt; 自定义组件 -&gt; 介绍 -&gt; #注意事项</a> <a href="#footnote-ref3" class="footnote-backref">↩︎</a></p></li><li id="footnote4" class="footnote-item"><p><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB" target="_blank" rel="noreferrer">指南 -&gt; 自定义组件 -&gt; 组件模板和样式 -&gt; #组件样式隔离</a> <a href="#footnote-ref4" class="footnote-backref">↩︎</a></p></li></ol></section>`,41)]))}const E=i(n,[["render",l]]);export{c as __pageData,E as default};
