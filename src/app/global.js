$(function(){
	/**
	 * info
	 */
	$.toast = function(info){
		layer.msg(info)
	}

    /**
     * loading
     */
    $.load = function(){
        var index = layer.load(1, {
            shade: [0.1,'#000'] //0.1透明度的白色背景
        });
        return index;
    }
    $.loadClose = function(index){
        layer.close(index)
    }
	
	/**
	 * 公用弹出窗口
	 * @param {String} info 信息
	 * @param {Int} type 类型 1、正确提示，2、错误，3、疑问，4、锁定，5
	 * @param {Function} fun
	 */
	$.alert = function(info,type,fun){
		if (info == undefined) {
			info = "操作成功"
		}
		if (type == undefined) {
			type = 0
		}
		layer.alert(info, {
		  icon: type,
		  skin: 'layui-layer-lan' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
		},function(index){
			layer.close(index)
			if (fun != undefined) {
				fun(index)
			}
		})
	}
	/**
	 * 确认提示窗
	 * @param {String} info
	 * @param {Int} type
	 * @param {Function} success // 成功回掉
	 * @param {Function} faile //失败回掉
	 */
	$.confirm = function(info,type,success,faile){
			if (info == undefined) {
				info = "确认这样操作吗？"
			}
			if (type == undefined) {
				type = 0
			}
			layer.confirm(info, {icon: 3, title:'提示',skin: 'layui-layer-lan'}, function(index){
				layer.close(index)
				if (success!=undefined){
					success(index)
				}
			},function(index){
				layer.close(index)
				if (faile!=undefined){
					faile(index)
				}
			})
	}
})
