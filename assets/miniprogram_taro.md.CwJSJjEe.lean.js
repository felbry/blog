import{_ as a,c as i,a4 as t,o as e}from"./chunks/framework.07rp2gkU.js";const E=JSON.parse('{"title":"Taro","description":"","frontmatter":{},"headers":[],"relativePath":"miniprogram/taro.md","filePath":"miniprogram/taro.md","lastUpdated":1732867126000}'),n={name:"miniprogram/taro.md"};function p(l,s,r,h,k,o){return e(),i("div",null,s[0]||(s[0]=[t(`<h1 id="taro" tabindex="-1">Taro <a class="header-anchor" href="#taro" aria-label="Permalink to &quot;Taro&quot;">​</a></h1><h2 id="生命周期" tabindex="-1">生命周期 <a class="header-anchor" href="#生命周期" aria-label="Permalink to &quot;生命周期&quot;">​</a></h2><p><a href="https://docs.taro.zone/docs/composition-api" target="_blank" rel="noreferrer">组合式API写生命周期</a>方式如下：</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { useReady } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@tarojs/taro&#39;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">useReady</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;等同于页面的 onReady 生命周期钩子&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>只有页面组件才能触发页面生命周期钩子，如果子组件也需要，可以通过Taro内置的消息机制实现，<a href="https://docs.taro.zone/docs/vue-page#onready-" target="_blank" rel="noreferrer">详见</a></p></div>`,5)]))}const c=a(n,[["render",p]]);export{E as __pageData,c as default};