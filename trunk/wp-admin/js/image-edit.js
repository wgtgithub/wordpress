var imageEdit;(function(a){imageEdit={iasapi:{},hold:{},postid:"",intval:function(b){return b|0},setDisabled:function(c,b){if(b){c.removeClass("disabled");a("input",c).removeAttr("disabled")}else{c.addClass("disabled");a("input",c).attr("disabled","disabled")}},init:function(g,e){var d=this,c=a("#image-editor-"+d.postid),b=d.intval(a("#imgedit-x-"+g).val()),f=d.intval(a("#imgedit-y-"+g).val());if(d.postid!=g&&c.length){d.close(d.postid)}d.hold.w=d.hold.ow=b;d.hold.h=d.hold.oh=f;d.hold.xy_ratio=b/f;d.hold.sizer=parseFloat(a("#imgedit-sizer-"+g).val());d.postid=g;a("#imgedit-response-"+g).empty();a('input[type="text"]',"#imgedit-panel-"+g).keypress(function(i){var h=i.keyCode;if(36<h&&h<41){a(this).blur()}if(13==h){i.preventDefault();i.stopPropagation();return false}})},toggleEditor:function(d,b){var c=a("#imgedit-wait-"+d);if(b){c.height(a("#imgedit-panel-"+d).height()).fadeIn("fast")}else{c.fadeOut("fast")}},toggleHelp:function(b){a(b).siblings(".imgedit-help").slideToggle("fast");return false},getTarget:function(b){return a("input:checked","#imgedit-save-target-"+b).val()||"all"},scaleChanged:function(i,b){var d=a("#imgedit-scale-width-"+i),f=a("#imgedit-scale-height-"+i),g=a("#imgedit-scale-warn-"+i),c="",e="";if(b){e=(d.val()!="")?this.intval(d.val()/this.hold.xy_ratio):"";f.val(e)}else{c=(f.val()!="")?this.intval(f.val()*this.hold.xy_ratio):"";d.val(c)}if((e&&e>this.hold.oh)||(c&&c>this.hold.ow)){g.css("visibility","visible")}else{g.css("visibility","hidden")}},getSelRatio:function(f){var b=this.hold.w,e=this.hold.h,d=this.intval(a("#imgedit-crop-width-"+f).val()),c=this.intval(a("#imgedit-crop-height-"+f).val());if(d&&c){return d+":"+c}if(b&&e){return b+":"+e}return"1:1"},filterHistory:function(h){var d=a("#imgedit-history-"+h).val(),b,g,e,c,f=[];if(d!=""){d=JSON.parse(d);b=this.intval(a("#imgedit-undone-"+h).val());if(b>0){while(b>0){d.pop();b--}}if(!d.length){this.newDims(h,this.hold.ow,this.hold.oh);return""}e=d[d.length-1];if(e.hasOwnProperty("c")){this.newDims(h,e.c.fw,e.c.fh)}else{if(e.hasOwnProperty("r")){this.newDims(h,e.r.fw,e.r.fh)}else{if(e.hasOwnProperty("f")){this.newDims(h,e.f.fw,e.f.fh)}}}for(g in d){c=d[g];if(c.hasOwnProperty("c")){f[g]={c:{x:c.c.x,y:c.c.y,w:c.c.w,h:c.c.h}}}else{if(c.hasOwnProperty("r")){f[g]={r:c.r.r}}else{if(c.hasOwnProperty("f")){f[g]={f:c.f.f}}}}}return JSON.stringify(f)}return""},refreshEditor:function(g,d,f){var c=this,e,b;c.toggleEditor(g,1);e={action:"imgedit-preview",_ajax_nonce:d,postid:g,history:c.filterHistory(g),rand:c.intval(Math.random()*1000000)};b=a('<img id="image-preview-'+g+'" />');b.load(function(){var i=a("#imgedit-crop-"+g),h=imageEdit;i.empty().append(b);h.initCrop(g,b,i);h.setCropSelection(g,0);if((typeof f!="unknown")&&f!=null){f()}h.toggleEditor(g,0)}).attr("src",ajaxurl+"?"+a.param(e))},action:function(b,g,c){var j=this,e,i,f,d,k;if(j.notsaved(b)){return false}e={action:"image-editor",_ajax_nonce:g,postid:b};if("scale"==c){i=a("#imgedit-scale-width-"+b),f=a("#imgedit-scale-height-"+b),d=j.intval(i.val()),k=j.intval(f.val());if(d<1){i.focus();return false}else{if(k<1){f.focus();return false}}if(d==j.hold.ow||k==j.hold.oh){return false}e["do"]="scale";e.fwidth=d;e.fheight=k}else{if("restore"==c){e["do"]="restore"}else{return false}}j.toggleEditor(b,1);a.post(ajaxurl,e,function(h){a("#image-editor-"+b).empty().append(h);j.toggleEditor(b,0)})},save:function(f,b){var c,e=this.getTarget(f),d=this.filterHistory(f);if(""==d){return false}this.toggleEditor(f,1);c={action:"image-editor",_ajax_nonce:b,postid:f,history:d,target:e,"do":"save"};a.post(ajaxurl,c,function(h){var g=JSON.parse(h);if(g.error){a("#imgedit-response-"+f).html('<div class="error"><p>'+g.error+"</p><div>");imageEdit.close(f);return}if(g.fw&&g.fh){a("#media-dims-"+f).html(g.fw+" &times; "+g.fh)}if(g.thumbnail){a(".thumbnail","#thumbnail-head-"+f).attr("src",""+g.thumbnail)}if(g.msg){a("#imgedit-response-"+f).html('<div class="updated"><p>'+g.msg+"</p></div>")}imageEdit.close(f)})},open:function(h,d){var f,e=a("#image-editor-"+h),c=a("#media-head-"+h),b=a("#imgedit-open-btn-"+h),g=b.siblings("img");b.attr("disabled","disabled");g.css("visibility","visible");f={action:"image-editor",_ajax_nonce:d,postid:h,"do":"open"};e.load(ajaxurl,f,function(){e.fadeIn("fast");c.fadeOut("fast",function(){b.removeAttr("disabled");g.css("visibility","hidden")})})},imgLoaded:function(d){var b=a("#image-preview-"+d),c=a("#imgedit-crop-"+d);this.initCrop(d,b,c);this.setCropSelection(d,0);this.toggleEditor(d,0)},initCrop:function(g,e,c){var b=this,d=a("#imgedit-sel-width-"+g),f=a("#imgedit-sel-height-"+g);b.iasapi=a(e).imgAreaSelect({parent:c,instance:true,handles:true,keys:true,minWidth:3,minHeight:3,onInit:function(h,i){c.children().mousedown(function(m){var k=false,l,j;if(m.shiftKey){l=b.iasapi.getSelection();j=b.getSelRatio(g);k=(l&&l.width&&l.height)?l.width+":"+l.height:j}b.iasapi.setOptions({aspectRatio:k})})},onSelectStart:function(h,i){imageEdit.setDisabled(a("#imgedit-crop-sel-"+g),1)},onSelectEnd:function(h,i){imageEdit.setCropSelection(g,i)},onSelectChange:function(h,j){var i=imageEdit.hold.sizer;d.val(imageEdit.round(j.width/i));f.val(imageEdit.round(j.height/i))}})},setCropSelection:function(g,f){var e,b=a("#imgedit-minthumb-"+g).val()||"128:128",d=this.hold.sizer;b=b.split(":");f=f||0;if(!f||(f.width<3&&f.height<3)){this.setDisabled(a(".imgedit-crop","#imgedit-panel-"+g),0);this.setDisabled(a("#imgedit-crop-sel-"+g),0);a("#imgedit-sel-width-"+g).val("");a("#imgedit-sel-height-"+g).val("");a("#imgedit-selection-"+g).val("");return false}if(f.width<(b[0]*d)&&f.height<(b[1]*d)){this.setDisabled(a(".imgedit-crop","#imgedit-panel-"+g),0);a("#imgedit-selection-"+g).val("");return false}e={x:f.x1,y:f.y1,w:f.width,h:f.height};this.setDisabled(a(".imgedit-crop","#imgedit-panel-"+g),1);a("#imgedit-selection-"+g).val(JSON.stringify(e))},close:function(c,b){b=b||false;if(b&&this.notsaved(c)){return false}this.iasapi={};this.hold={};a("#image-editor-"+c).fadeOut("fast",function(){a("#media-head-"+c).fadeIn("fast");a(this).empty()})},notsaved:function(e){var c=a("#imgedit-history-"+e).val(),d=(c!="")?JSON.parse(c):new Array(),b=this.intval(a("#imgedit-undone-"+e).val());if(b<d.length){if(confirm(a("#imgedit-leaving-"+e).html())){return false}return true}return false},addStep:function(i,h,d){var c=this,e=a("#imgedit-history-"+h),g=(e.val()!="")?JSON.parse(e.val()):new Array(),f=a("#imgedit-undone-"+h),b=c.intval(f.val());while(b>0){g.pop();b--}f.val(0);g.push(i);e.val(JSON.stringify(g));c.refreshEditor(h,d,function(){c.setDisabled(a("#image-undo-"+h),true);c.setDisabled(a("#image-redo-"+h),false)})},rotate:function(d,e,c,b){if(a(b).hasClass("disabled")){return false}this.addStep({r:{r:d,fw:this.hold.h,fh:this.hold.w}},e,c)},flip:function(d,e,c,b){if(a(b).hasClass("disabled")){return false}this.addStep({f:{f:d,fw:this.hold.w,fh:this.hold.h}},e,c)},newDims:function(f,c,e){var b=Math.max(c,e),d;d=b>400?400/b:1;this.hold.sizer=d;this.hold.w=c;this.hold.h=e;return d},crop:function(e,c,b){var d=a("#imgedit-selection-"+e).val();if(a(b).hasClass("disabled")||d==""){return false}d=JSON.parse(d);if(d.w>0&&d.h>0){d.fw=this.intval(a("#imgedit-sel-width-"+e).val());d.fh=this.intval(a("#imgedit-sel-height-"+e).val());this.addStep({c:d},e,c)}},undo:function(g,e){var d=this,c=a("#image-undo-"+g),f=a("#imgedit-undone-"+g),b=d.intval(f.val())+1;if(c.hasClass("disabled")){return}f.val(b);d.refreshEditor(g,e,function(){var h=a("#imgedit-history-"+g),i=(h.val()!="")?JSON.parse(h.val()):new Array();d.setDisabled(a("#image-redo-"+g),true);d.setDisabled(c,b<i.length)})},redo:function(g,e){var d=this,c=a("#image-redo-"+g),f=a("#imgedit-undone-"+g),b=d.intval(f.val())-1;if(c.hasClass("disabled")){return}f.val(b);d.refreshEditor(g,e,function(){d.setDisabled(a("#image-undo-"+g),true);d.setDisabled(c,b>0)})},setNumSelection:function(c){var g,k=a("#imgedit-sel-width-"+c),j=a("#imgedit-sel-height-"+c),o=this.intval(k.val()),m=this.intval(j.val()),i=a("#image-preview-"+c),p=i.height(),h=i.width(),b=this.hold.sizer,f,n,e,l,d=this.iasapi;if(o<1){k.val("");return false}if(m<1){j.val("");return false}if(o&&m&&(g=d.getSelection())){e=g.x1+Math.round(o*b);l=g.y1+Math.round(m*b);f=g.x1;n=g.y1;if(e>h){f=0;e=h;k.val(Math.round(e/b))}if(l>p){n=0;l=p;j.val(Math.round(l/b))}d.setSelection(f,n,e,l);d.update();this.setCropSelection(c,d.getSelection())}},round:function(b){var c;b=Math.round(b);if(this.hold.sizer>0.6){return b}c=b.toString().slice(-1);if("1"==c){return b-1}else{if("9"==c){return b+1}}return b},setRatioSelection:function(j,i,d){var f,e,b=this.intval(a("#imgedit-crop-width-"+j).val()),g=this.intval(a("#imgedit-crop-height-"+j).val()),c=a("#image-preview-"+j).height();if(!this.intval(a(d).val())){a(d).val("");return}if(b&&g){this.iasapi.setOptions({aspectRatio:b+":"+g});if(f=this.iasapi.getSelection(true)){e=Math.ceil(f.y1+((f.x2-f.x1)/(b/g)));if(e>c){e=c;if(i){a("#imgedit-crop-height-"+j).val("")}else{a("#imgedit-crop-width-"+j).val("")}}this.iasapi.setSelection(f.x1,f.y1,f.x2,e);this.iasapi.update()}}}}})(jQuery);