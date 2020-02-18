const Fs=require("fire-fs"),GoogleAnalytics=Editor.require("packages://cc-inspector/core/GoogleAnalytics.js");Editor.Panel.extend({style:Fs.readFileSync(Editor.url("packages://cc-inspector/panel-preview-web/index.css"),"utf-8"),template:Fs.readFileSync(Editor.url("packages://cc-inspector/panel-preview-web/index.html"),"utf-8"),$:{},ready(){GoogleAnalytics.init(),GoogleAnalytics.eventCustom("[preview] panel-open-preview"),this.plugin=new window.Vue({el:this.shadowRoot,created(){this.$nextTick(function(){let e=this.$els.web;e.addEventListener("did-start-loading",function(){}),e.addEventListener("did-stop-loading",function(){}),e.addEventListener("dom-ready",function(t){this.url=t.srcElement.src;const i=e.getWebContents();i.on("new-window",function(e,t){e.preventDefault();this._setPreviewUrl(t)}.bind(this)),i.on("did-frame-finish-load",function(e,t){})}.bind(this)),this.initWebViewUrl()}.bind(this))},init(){},data:{url:"",defaultCfg:{docs:{name:"文档",url:"http://docs.cocos.com/creator/manual/zh/"},forum:{name:"论坛",url:"http://forum.cocos.com/c/Creator"},baidu:{name:"百度",url:"http://www.baidu.com"}}},methods:{onChangeWebUrl(e){let t=e.currentTarget.$select.value;t&&(GoogleAnalytics.eventCustom(`[preview] Short-ChangeWebUrl: ${t}`),this._setPreviewUrl(t))},onBtnClickWebGoBack(){this.$els.web.goBack();GoogleAnalytics.eventCustom("[preview] GoBack")},onBtnClickWebForward(){this.$els.web.goForward(),GoogleAnalytics.eventCustom("[preview] Go Forward")},_autoAddHttp(e){return 0===e.indexOf("http://")||0===e.indexOf("https://")?e:"http://"+this.url},onUrlInputOver(){if(null===this.url||0===this.url.length)return;GoogleAnalytics.eventCustom(`[preview] InputUrlByHand: ${this.url}`);let e=this._autoAddHttp(this.url);this._setPreviewUrl(e)},getIsGameUrl(){let e=Editor.remote.PreviewServer.previewPort,t="localhost:"+e,i="127.0.0.1:"+e;return-1!==this.url.indexOf(t)||-1!==this.url.indexOf(i)},_setPreviewUrl(e){let t=this.$els.web.src;const i=require("url");return i.parse(t).href!==i.parse(e).href&&(this.$els.web.src=e,this.url=e,!0)},onBtnClickHome(){let e=this._getPreviewUrl();this._setPreviewUrl(e);GoogleAnalytics.eventCustom("[preview] GoHome")},_getPreviewUrl(){let e=Editor.remote.PreviewServer.previewPort;return void 0===e&&(e="7456"),"http://localhost:"+e+"/"},initWebViewUrl(){let e=this._getPreviewUrl();this._setPreviewUrl(e)},onBtnClickOpenDevTools(){this.$els.web.openDevTools(),GoogleAnalytics.eventCustom("[preview] OpenDevTools")},onBtnClickReload(){let e=this.$els.web;e&&(e.reload(),GoogleAnalytics.eventCustom("[preview] Reload"))}}})},messages:{}});