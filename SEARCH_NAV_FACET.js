
var path = "";  
var path_ = path; 
var basePath = "https://www.pharmacodia.com:443/";
var language = "cn";
var homeUriPath = "https://www.pharmacodia.com/";
var isLogin = "false";

var SEARCH_NAV_FACET = {
    //请求的URI,请勿携带分页相关参数
    requestURI:"/web/drug/query",
    //form表单ID
    search_form_id:"search_form_id",
    //获取当前form表单,q参数前缀,递归调用
    q_prefix:"q.child",
    sort_prefix:"sort",
    //是否存在分面搜索对象对象
    ifExist_SEARCH_NAV_FACET :function(){
        if(1<$(".search_nav_facet").length){
            return false;
        }else{
            return true;
        }
    },
    initEvent:function(){
        //toggle 点击切换事件,1.9以后被移除
        $(".facets_box .show_or_hide").click(function(e){
                var $this = $(this);
                var $col_2 = $this.parent().parent();
                if($this.hasClass("hide_")){
                    //设置为 展开效果
                    $this.removeClass("hide_").addClass("show_");
                    $col_2.removeClass("hide_part");
                }else{
                //设置为 隐藏效果
                    $this.removeClass("show_").addClass("hide_");
                    $col_2.addClass("hide_part");
                }
        });
        //点击多选设置
        $(".facets_box .change_more").click(function(e){
            var $this = $(this);
            var $col_2 = $this.parent().parent();
            var $do_box_bottom = $this.parent().parent().find(" .do_box_bottom_hide");
            if(0<$do_box_bottom.length){
                $this.addClass("selectd");
                $do_box_bottom.removeClass("do_box_bottom_hide");
                $col_2.removeClass("hide_part"); //展开
                $col_2.addClass("change_more_box");
            }
            //同时隐藏  收起按钮
            var $show_or_hide = $this.parent().find(" .show_or_hide");
            if(!$show_or_hide.hasClass("hide_")){
                $show_or_hide.addClass("hide_");
            }
            if(!$show_or_hide.hasClass("show_")){
                $show_or_hide.addClass("show_");
            }
        });
        //点击取消设置
        $(".facets_box .btn-cancel").click(function(e){
            var $this = $(this);
            $(".col_2.hide_part.val_box").css('scrollTop',0);
            var $do_box_bottom = $this.parent().parent().find(" .do_box_bottom");
            var $change_more = $this.parent().parent().find(" .change_more.selectd");
            if(0<$do_box_bottom.length){
                $change_more.removeClass("selectd");
                $do_box_bottom.addClass("do_box_bottom_hide");
                var $col_2 = $this.parent().parent();
                //设置隐藏部分
                $col_2.addClass("hide_part");
                //移除容器多选标记
                $col_2.removeClass("change_more_box");
                //是否显示跟多
                var $facet_box = $col_2.parent();
                SEARCH_NAV_FACET.initMoreBut($facet_box)
            }
        });
        //点击确定设置
        $(".facets_box .btn-confirm").click(function(e){
            var $this = $(this);
            var $col_2 = $this.parent().parent();
            if($col_2.hasClass("change_more_box")){
                var $col_1 = $col_2.parent().find(">.col_1");
                if(1>$col_1.length){
                    return false;
                }
                var fieldShowName =  $col_1.attr("fieldShowName");
                //获取选择的
                $span_selectd = $col_2.find(".val_box>span.selectd");
                var fieldArray = [];
                var valArray = [];
                var valshownameArray = [];
                if($span_selectd.length > 10){
                    var message = "en" === "cn"?'The selected conditions can not be more than 10.':'已选条件不能大于10个.';
                    //$().toastmessage('showWarningToast', message);
                    alert(message);
                    return false;
                }
                $.each($span_selectd,function(i,n){
                    $n = $(n);
                    var field = $n.attr("field");
                    var val = $n.attr("val");
                    var valshowname = $n.attr("valshowname");
                    fieldArray.push(field);
                    valArray.push(val);
                    valshownameArray.push(valshowname);
                });
                if(fieldArray && 0<fieldArray.length){
                    var isQ = false;
                    //var fieldShowName =  fieldShowName;
                    var field = fieldArray[0];
                    var val =valArray.toString();
                    var valShowName = valshownameArray.toString();
                    //
                    SEARCH_NAV_FACET.searchFormRemoveQ(field);
                    SEARCH_NAV_FACET.searchFormAddQ(isQ,field,fieldShowName,val,valShowName);
                    SEARCH_NAV_FACET.searchFormSubmit();
                }
                return false;
            }
        });

        //搜索值 对应的点击事件
        $(".facets_box .val_box>span").click(function(){
            var $this = $(this);
            var $col_2 = $this.parent().parent();
            if($col_2.hasClass("change_more_box")){
                if(!$this.hasClass("selectd")){
                    $this.addClass("selectd");
                }else{
                    $this.removeClass("selectd");
                }
            }else{
                var $col_1 = $col_2.parent().find(">.col_1");
                if(1>$col_1.length){
                    return false;
                }
                var isQ = false;
                var fieldShowName =  $col_1.attr("fieldShowName");
                var field = $this.attr("field");
                var val = $this.attr("val");
                var valShowName = $this.attr("valShowName");
                //
                SEARCH_NAV_FACET.searchFormRemoveQ(field);
                SEARCH_NAV_FACET.searchFormAddQ(isQ,field,fieldShowName,val,valShowName);
                SEARCH_NAV_FACET.searchFormSubmit();

            }
        });

        //删除查询条件事件
        $(".qs_box .delete_but").click(function(e){
            var $this = $(this);
            var $search_form =  $("#"+SEARCH_NAV_FACET['search_form_id']);
            var q_group = $this.attr("q_group");
            if(!q_group || null == q_group || ""==q_group){
                return false;
            }
            var $q_group = $search_form.find("*[q_group='"+q_group+"']");
            if(0<$q_group.length){
                //删除查询条件
                $q_group.remove();
            }
            //删除历史查询条件
            $this.parent().remove();
            //重新设置查询条件,需要重新设置分页参数,回到第一页
            SEARCH_NAV_FACET.searchFormSetPager(1,null);
            //执行表单查询
            SEARCH_NAV_FACET.searchFormSubmit();
        });
    },
    //初始化工具栏事件
    initToolsEvents:function(){
        //排序条件设置
        $(".search_nav_facet .tools_box .order_item").click(function(e){
            var $this = $(this);
            var field = $this.attr("field");
            var fieldShowName = $this.attr("fieldShowName");
            var order = $this.attr("order");
            var isDesc = true;
            if(!field){
                return false;
            }
            isDesc = ("desc"!=order?true:false);
            //清理排序项
            SEARCH_NAV_FACET.searchFormRemoveSort();
            //添加新的排序项
            SEARCH_NAV_FACET.searchFormAddSort(field,fieldShowName,isDesc);
            //执行表单查询
            SEARCH_NAV_FACET.searchFormSubmit();
        });
        //
        $(".search_nav_facet .tools_box .pager_size_set_box select").change(function(e){
            var $this = $(this);
            var size = $this.val();
            //设置分页参数
            SEARCH_NAV_FACET.searchFormSetPager(1,size);
            //执行表单查询
            SEARCH_NAV_FACET.searchFormSubmit();
        });

    },
    //初始化更多按钮是否显示
    initMoreBut:function($facet_box){
        var $facets_box = $(".search_nav_facet .facets_box");
        //如果设置了查询范围
        if($facet_box && 0<$facet_box.lenght){
            $facets_box = $facet_box;
        }
        $.each($facets_box.find(" .val_box"),function(i,n){
            var $n = $(n);
            var $show_or_hide = $n.parent().find(" .show_or_hide");
            //alert($n.height());
            if(30<$n.height()){
                //保留状态样式:hide_,移除状态:show_,则自动显示 更多按钮
                $show_or_hide.removeClass("show_");
            }
        });
    },
    //获取上一次的URI
    getLastURI :function(){
        var requestURI = SEARCH_NAV_FACET['requestURI'];
        var lastOptionsURI =  $("#search_nav_facet_qs_form").serialize();
        var url =  requestURI+"&"+lastOptionsURI;
        return url;
    },
    //查询表单-添加查询项
    searchFormAddQ :function(isQ,field,fieldShowName,val,valShowName){
        var $search_form =  $("#"+SEARCH_NAV_FACET['search_form_id']);
        var q_prefix = SEARCH_NAV_FACET['q_prefix'];
        $search_form.append("<input type=\"hidden\" name=\""+q_prefix+".isq\" value=\""+isQ+"\">");
        $search_form.append("<input type=\"hidden\" name=\""+q_prefix+".field\" value=\""+ field +"\">");
        $search_form.append("<input type=\"hidden\" name=\""+q_prefix+".fieldShowName\" value=\""+ fieldShowName +"\">");
        $search_form.append("<input type=\"hidden\" name=\""+q_prefix+".val\" value=\""+ val +"\">");
        $search_form.append("<input type=\"hidden\" name=\""+q_prefix+".valShowName\" value=\""+ valShowName +"\">");
        //添加查询条件,需要重新设置分页参数,回到第一页
        SEARCH_NAV_FACET.searchFormSetPager(1,null);
    },
    //查询表单-删除查询项
    searchFormRemoveQ :function(field){
        var $search_form =  $("#"+SEARCH_NAV_FACET['search_form_id']);
        var $temp = $search_form.find("input[value="+field+"]");
        if(0 < $temp.length){
            var q_group = $temp.attr("q_group");
            if(null != q_group && "" != q_group){
                $search_form.find("input[q_group='"+q_group+"']").remove();
            }
        }
        //删除查询条件,需要重新设置分页参数,回到第一页
        SEARCH_NAV_FACET.searchFormSetPager(1,null);
    },

    //
    //查询表单-删除查询项-排序条件
    searchFormRemoveSort :function(field){
        var $search_form =  $("#"+SEARCH_NAV_FACET['search_form_id']);
        var sort_prefix = SEARCH_NAV_FACET['sort_prefix'];
        if(!field || null == field || ""==field){
            $search_form.find("*[name^='sort']").remove();
        }else{
            $search_form.find("*[name^='sort'][field='"+field+"']").remove();
        }

    },
    //查询表单-添加查询项-排序条件
    searchFormAddSort :function(field,fieldShowName,isDesc){
        var $search_form =  $("#"+SEARCH_NAV_FACET['search_form_id']);
        var sort_prefix = SEARCH_NAV_FACET['sort_prefix'];
        $search_form.append("<input field=\""+field+"\" type=\"hidden\" name=\""+sort_prefix+".field\" value=\""+ field +"\">");
        $search_form.append("<input field=\""+field+"\" type=\"hidden\" name=\""+sort_prefix+".fieldShowName\" value=\""+ fieldShowName +"\">");
        $search_form.append("<input field=\""+field+"\" type=\"hidden\" name=\""+sort_prefix+".isDesc\" value=\""+ isDesc +"\">");
    },
    //设置分页参数
    searchFormSetPager:function(page,size){
        var $search_form =  $("#"+SEARCH_NAV_FACET['search_form_id']);
        if(page && null!=page && ""!=page){
            var $page = $search_form.find(" input[name='page']");
            page = Number(page);
            page = (1>page)?1:page;
            if(1>$page.length){
                    $page = $("<input type=\"hidden\" name=\"page\" value=\""+page+"\">");
                    $search_form.append($page);
            }else{
                $page.val(page);
            }
        }

        if(size && null!=size && ""!=size){
            var $size = $search_form.find(" input[name='size']");
            size = Number(size);
            size = (1>size || 100<size)?20:size;
            if(1>$size.length){
                    $size = $("<input type=\"hidden\" name=\"size\" value=\""+size+"\">");
                    $search_form.append($size);
            }else{
                $size.val(size);
            }
        }
    },
    //查询表单-提交表单
    searchFormSubmit:function(){
        var $search_form =  $("#"+SEARCH_NAV_FACET['search_form_id']);
        $search_form.submit();
    },
    //跳转到指定的页面
    toPage:function(page,size){
        var total = Number("37");
        page = Number(page);
        if(1>page || total<page){
            return false;
        }
        //设置分页参数
        SEARCH_NAV_FACET.searchFormSetPager(page,size);
        //执行表单查询
        SEARCH_NAV_FACET.searchFormSubmit();
    },
    //其他选项的处理
    otherFacetDox:function(){
        //
        
        
    }

}