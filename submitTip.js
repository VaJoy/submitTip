/*
 submitTip 1.0.1
 Licensed under the MIT license.
 https://github.com/VaJoy/submitTip
 */
(function($,win,doc){
    $.fn.submitTip = function(option) {
        var noop = function(){};
        option = option || {};
        option = $.extend(true, {
            url:'',
            form: '',
            type: 'post',
            maskClass: 'mask',
            tip: '#tip-wrap',
            showTime: 500,
            compare: !0,
            buffer: noop,
            filter: function(){ return !0 },
            callback: noop,
            error: noop
        }, option);

        var $btn = $(this),
            $form = $(option.form),
            datas = {},
            datas_s = '',
            buffer = '',
            $mask = $('<div class="' + option.maskClass + '" ></div>'),
            $tip = $(option.tip),
            tipHtml = $tip.html();

        $tip.hide();

        $btn.off("click").on("click",function(){
            datas = $form.serializeArray();
            if(antiShake()) return;
            if(!option.filter(datas,$mask,$tip,tipHtml)) return;
            req();
            initUI();
        });

        $(win).resize(pinTip);

        function initUI(){
            $mask.hide().appendTo("body").fadeIn(option.showTime);
            $tip.fadeIn(option.showTime);
            pinTip();
        }

        function antiShake(){
            if(!option.compare) return !1;
            datas_s = $form.serialize();
            buffer = $btn.data('form-data');
            if(buffer && datas_s===buffer){
                initUI();
                option.buffer($mask,$tip,tipHtml);
                return !0
            }
            $btn.data('form-data',datas_s);
            return !1
        }

        function req(){
            $.ajax({
                url: option.url,
                type: option.type,
                data: datas,
                success: function(data){
                    option.callback(data,$mask,$tip,tipHtml);
                },
                error: function(e){
                    $btn.data('form-data','');
                    option.error(e,$mask,$tip,tipHtml);
                }
            })
        }

        function pinTip(){
            var vp_h = win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight,
                width = $tip[0].getBoundingClientRect().width || $tip[0].offsetWidth,
                height = $tip[0].getBoundingClientRect().height || $tip[0].offsetHeight;
            $tip.css({ position:'fixed', top : (vp_h - height)/2 , left:'50%', marginLeft: -width/2 })
        }

        return $btn;
    }
})(jQuery,window,document);