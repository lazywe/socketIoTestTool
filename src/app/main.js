$(function(){
    var debug = false;
    var connectionBtn = $(".connectionBtn"),logPanal = $(".log");
    var hostInput = $(".host")
    var host,socketIo,socketIoType = 1,isConnect = false
    var isScroll = true;
    var logs = []
    var onKey = []
    connectionBtn.live('click',function(){
        if (socketIoType == 1){
            var t = $(this);
            host = hostInput.val();
            if (host == ""){
                $.reloadLog("连接状态","请输入socket主机，","error")
                return false;
            }
            connectionBtn.val("取消连接")
            // 当前主机
            $.reloadLog("当前主机",host,"normal")
            // 连接
            $.reloadLog("连接状态","准备连接","normal")
            socketIo = io(host)
            socketIo.on("connect",function(){
                isConnect = true
                $.reloadLog("连接状态","成功","success")
            })

            socketIo.on("connect_error",function(e){
                $.reloadLog("连接状态","错误信息："+ JSON.stringify(e),"error")
            })
            socketIo.on("disconnect",function(e){
                isConnect = false
                $.reloadLog("连接状态","取消连接成功","success")
            })
            socketIoType = 2;
        }else{
            $.reloadLog("连接状态","取消连接","normal")
            socketIoType = 1;
            connectionBtn.val("连接")
            socketIo.disconnect()
        }
    })

    /**
     * 推送
     */
    $(".emit").live("click",function(){
        var emitKeyDom = $(".emit-key");
        var emitValueDom = $(".emit-value");
        var emitKey = emitKeyDom.val();
        var emitValue = emitValueDom.val();
        if (isConnect == false){
            $.reloadLog("推送信息","未连接Socket","error")
            return false;
        }else if (emitKey == "") {
            $.reloadLog("推送信息","请输入推送Key","error")
            return false;
        }else if (emitValue == "") {
            $.reloadLog("推送信息","请输入推送内容","error")
            return false;
        }else{
            $.reloadLog("推送状态","准备推送","normal")
            socketIo.emit(emitKey,emitValue,function(e){
                $.reloadLog("推送状态","推送成功", "success")
                if (e != undefined){
                    $.reloadLog("推送状态","返回信息：" + e,"normal")
                }
            })
        }
    })

    /**
     * 接受推送key
     */
    $(".saveOn").live("click",function(){
        var saveValueDom = $(".saveValue");
        var saveValue = saveValueDom.val();
        if (isConnect == false){
            $.reloadLog("监听信息","未连接Socket","error")
            return false;
        }else if (saveValueDom == "") {
            $.reloadLog("监听信息","请输入监听Key","error")
            return false;
        }else{
            var saveObj = saveValue.split(",");
            for (i in saveObj) {
                if (saveObj[i] == ""){
                    continue;
                }
                $.reloadLog("监听信息","监听" + saveObj[i] + "成功","success")
                socketIo.off(saveObj[i]).on(saveObj[i],function(e){
                    $.reloadLog("监听信息","key："+saveObj[i]+"，value："+e,"normal")
                })
            }
        }
    })

    /**
     * 刷新log
     * 
     * @param title 标题
     * @param info  内容
     * @param level 等级，不同等级颜色不同  normal|默认灰色  error|红色  success|绿色 
     */
    $.reloadLog = function(title, info, level){
        var log = {title:title,info:info,level:level}
        logs.push(log)
        var html = "<ul>"
        for (index in logs) {
            var levelCss = "normal"
            if (logs[index].level == "error"){
                levelCss = "error"
            }else if (logs[index].level == "success") {
                levelCss = "success"
            }
            html += '<li><span class="title">'+logs[index].title+'：</span><span class="info '+levelCss+'">'+logs[index].info+'</span></li>'
        }
        html += "<ul>"
        logPanal.html(html)
        if (debug == true) {
            console.log(logs)
            console.log(logPanal.find("ul").height())
        }
        if (isScroll == true){
            logPanal.scrollTop( logPanal.find("ul").height() );
        }
    }

    /**
     * 清除log
     */
    $(".clear").live("click",function(){
        logs = []
        logPanal.html("");
    })

    /**
     * 滚屏切换
     */
    $(".scrollPower").live("click",function(){
        var t = $(this);
        if (isScroll == true){
            isScroll = false
            t.val("滚屏")
        }else{
            isScroll = true
            t.val("取消滚屏")
        }
    })

    var gui = require('nw.gui');
    var win = gui.Window.get();
    win.show();
})