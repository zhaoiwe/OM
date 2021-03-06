jQuery(function ($) {
    $("#submenu-menu-device-clean").addClass("active");
    $("#menu-device").addClass("active");
    $("#menu-device").addClass("open");

    $("#keyword").keyup(function () {
        initGoodsTable();
    });

    function check() {
        var flag = true;
        $("form :input.required").each(function () {
            var val = $(this).val();
            if (!val) {
                $(this).addClass("required-tip");
                flag = false;
            }
        });
        return flag;
    }

    //$('#debtForm').bootstrapValidator({
    //    message: 'This value is not valid',
    //    submitButtons: null,
    //    feedbackIcons: {
    //        valid: 'glyphicon glyphicon-ok',
    //        invalid: 'glyphicon glyphicon-remove',
    //        validating: 'glyphicon glyphicon-refresh'
    //    },
    //    fields: {
    //        'storageDebt.debtDate': {
    //            validators: {
    //                notEmpty: {}
    //            }
    //        },
    //    }
    //});
    //$("#storageDebt_debtDate").change(function () {
    //    $("#debtForm")
    //        .data('bootstrapValidator')
    //        .updateStatus('storageDebt.debtDate', 'NOT_VALIDATED')
    //        .validateField('storageDebt.debtDate');
    //}),

    //单个追加用户到交接用户
    $(document).on("dblclick", "#checkUser_list tbody tr", function () {
        var $choiseSeller = getChoiseUserInfo($(this));
        var a = $("#checkUserId").val($choiseSeller.userId);
        $("#checkUser").val($choiseSeller.realName);
        $("#checkUser_choise_modal").modal('hide');
        //focusNumbox();
    });

    //单个追加设备到表单
    $(document).on("dblclick", "#search_device_table tbody tr", function () {
        var $choiseDevice = getChoiseDeviceInfo($(this));
        var sid = $("#deviceName").val();
        $("#" + sid + "").val($choiseDevice.deviceName);
        $("#" + "deviceId" + sid + "").val($choiseDevice.deviceId);
        $("#device_choise_modal").modal('hide');
        focusNumbox();
    });

    $("#storageDebt_debtDate").datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 1,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
    });


    //批量选择时，单个checkbox选中改变背景颜色
    $(document).on("click", "#search_goods_table td input:checkbox", function () {
//		if($(this).prop("checked")){
//			$(this).closest("tr").addClass("row-click");
//			$(this).closest("tr").find("td").addClass("row-click");
//		} else {
//			$(this).closest("tr").removeClass("row-click");
//			$(this).closest("tr").find("td").removeClass("row-click");
//		}
        var checkedCount = $("#search_goods_table input:checkbox:checked").length;
        if (checkedCount > 0) {
            $("#choise_submit").removeClass("disabled");
        } else {
            $("#choise_submit").addClass("disabled");
        }
    });

    //单击查询商品列表行，改变背景颜色
    $(document).on("click", "#search_goods_table tbody tr", function () {
        var $choise_row = $(this);
        var choiseType = $("#choise_type").val();
        //单个选择
        if (choiseType == '0') {
            $("#search_goods_table tbody tr").removeClass("row-click");
            $("#search_goods_table tbody tr td").removeClass("row-click");
            $choise_row.addClass("row-click");
            $choise_row.find("td").addClass("row-click");
        }
        //批量选择
        if (choiseType == '1') {
//			var $checkbox = $choise_row.find("input:checkbox").eq(0);
//			if($checkbox.prop("checked")) {
//				$checkbox.prop("checked",false);
//			} else {
//				$checkbox.prop("checked",true);
//			}
//			console.info($checkbox.prop("checked"));
        }
    });


    //站点选择列表checkbox全选，全不选
    $(document).on('click', 'th input:checkbox', function () {
        var that = this;
        if (that.checked) {
            $("#choise_submit").removeClass("disabled");
        } else {
            $("#choise_submit").addClass("disabled");
        }
        $(this).closest('table').find('tr > td:first-child input:checkbox').each(function () {
            this.checked = that.checked;
            $(this).closest('tr').toggleClass('selected');
        });
    });

    showMenu();
});


var gTable = null;
function initGoodsTable() {
    if (gTable == null) {
        gTable = $("#search_goods_table").dataTable({
            "bAutoWidth": false,
            "bLengthChange": false,
//			"bProcessing": false,
            "bFilter": false,// 搜索栏
            "bServerSide": true,//异步请求必须设置
            "sAjaxSource": ROOT_PATH + "/view/goods/goodsInfo/queryGoodsInfoPage.action", //异步请求地址 ：查询站点信息
            "aoColumns": [
                {
                    "sDefaultContent": "",
                    "sClass": "center",
                    "bSortable": false,
                    "mRender": function (data, type, full) {
                        return '<label class="position-relative">' +
                            '<input type="checkbox" class="ace" value="' + full.goodsId + '"/><span class="lbl"></span></label>';
                    }
                },
                {
                    "mDataProp": "goodsName", "sClass": "center", "mRender": function (data, type, full) {
                    return '<label name="goodsName">' + data + '</label>';
                }
                },
                /* {"mDataProp":"carLineId","mRender": function(data, type, full) {
                 return '<label name="carLineId">'+ data + '</label>';
                 }},*/
                {
                    "mDataProp": "goodsTypeName", "sClass": "center", "mRender": function (data, type, full) {
                    return '<label  name="gtName">' + data + '</label>';
                }
                },
                {
                    "mDataProp": "unitName", "sClass": "center", "mRender": function (data, type, full) {
                    return '<label name="measurementUnit">' + data + '</label>';
                }
                },
                {
                    "mDataProp": "goodsSpell", "sClass": "center", "mRender": function (data, type, full) {
                    return '<label name="goodsSpell">' + data + '</label>';
                }
                },
            ],
            "aoColumnDefs": [//和aoColums类似，但他可以给指定列附近爱属性
                {"bSortable": false, "aTargets": [0, 1, 2, 3, 4]}  //这句话意思是第1,3,6,7,8,9列（从0开始算） 不能排序
            ],
            "fnServerData": retrieveData,

        });
    } else {
//		oTable.fnClearTable(0); //清空数据
        gTable.fnDraw(); //重新加载数据
    }

}
/**
 * sSource   查询链接
 * aoData    参数
 * fnCallback 返回数据填充方法
 */
function retrieveData(sSource, aoData, fnCallback) {
    //商品名称或编号
    var keyword = $("#keyword").val();
    var param = {
        "keyword": keyword,
        "orgFilter": '1'
    };


    for (var i = 0; i < aoData.length; i++) {
        var _aoData = aoData[i];
        if (_aoData.name == "iDisplayStart") {
            /*开始页数*/
            param.iDisplayStart = _aoData.value;
        } else if (_aoData.name == "iDisplayLength") {
            /*记录条数*/
            param.iDisplayLength = _aoData.value;
        } else if (_aoData.name == "sEcho") {
            /*操作次数*/
            param.sEcho = _aoData.value;
        }
    }
    //提交访问
    $.ajax({
        type: "POST",
        url: sSource,
        dataType: "json",
        data: param, // 以json格式传递
        success: function (resp) {
            fnCallback(resp);
//            removeMask($('.goods-container'));
        }
    });
}

//单个选择站点
function choiseGoods(input_goodsName) {
    initOrgTree();
    resetSelectGoodsForm();
    var $ele_tr = $(input_goodsName).parents("tr:eq(0)"); //得到选择的行数
    $("#purchase_goods_rowno").val($ele_tr.find("td").eq(0).html());
    $("#choise_type").val('0');
    //隐藏列表第一列
    gTable.fnSetColumnVis(0, false);
    //隐藏底部批量操作的按钮
    $("#choise_goods_action").hide();
    $('#goods_choise_modal').modal('show');
}

//批量选择站点
function batchChoiseGoods() {
    //if ($("#storageDebt_debtDate").val() == '') {
    //    alert("请先选择出库仓库");
    //    return false;
    //}
    initOrgTree();
    resetSelectGoodsForm();
    $("#choise_type").val('1');
    //显示列表第一列
    gTable.fnSetColumnVis(0, true);
    $("#choise_goods_action").show();
    $('#goods_choise_modal').modal('show');
}


//批量追加站点到表单
function batchAppendGoods() {
    var $purchase_goods_list = $("#purchase_goods_list");
    var $pgl_fr = $purchase_goods_list.find("tr").eq(0);  //找到第一行
    var fr_goodsName = $pgl_fr.find("td").eq(1).find("input[type='hidden']").val(); //取第一列单元格goodsname的值
    var rowCount = $purchase_goods_list.find("tr").length; //得到行数
    if (!fr_goodsName) {
        rowCount = rowCount - 1;
        $pgl_fr.remove();
    }
    //遍历查询站点列表，添加选择的站点到表单显示页面
    $("#search_goods_table td input:checkbox:checked").each(function (i) {
        var goodsId = $(this).val();
        if (!existPurchaseGoods(goodsId)) {
            var $choise_row = $(this).closest('tr');
            rowCount = rowCount + 1;
            var append_row_no = rowCount;
            var append_row = createPurchaseGoodsRow(append_row_no);

            var $choiseGoods = getChoiseGoods($choise_row);
            $purchase_goods_list.append(append_row);
            fillGoodsInfo(append_row_no, $choiseGoods);
        }
    });
    //$("#search_goods_table input:checkbox").removeAttr("checked");
    //$("#choise_submit").addClass("disabled");
    $("#choise_submit").addClass("disabled");
    focusNumbox();

}

//获得选择站点各项值
function getChoiseGoods(ele_goodsRow) {
    var $choiseGoods = {};
    var $ele_td = ele_goodsRow.find("td");
    $choiseGoods.goodsId = $ele_td.find("input[type=checkbox]").eq(0).val();
    $choiseGoods.goodsName = $ele_td.find("label[name='goodsName']").eq(0).html();
    //$choiseGoods.goodsName = $ele_td.find("label[name='goodsName']").eq(0).html()
    //$choiseGoods.goodsTypeNo = $ele_td.find("label[name='goodsTypeNo']").eq(0).html()
    //$choiseGoods.measurementUnit = $ele_td.find("label[name='measurementUnit']").eq(0).html()
    //$choiseGoods.goodsSpell = $ele_td.find("label[name='goodsSpell']").eq(0).html()
    //$choiseGoods.nodeSort = $ele_td.find("label[name='nodeSort']").eq(0).html()
    return $choiseGoods;
}

//是否已存在 已选中的站点
function existPurchaseGoods(goodsId) {
    var flag = false;
    $("#purchase_goods_list").find("tr").each(function (i) {
        var purchase_goodsId = $(this).find("input[type=hidden]").eq(0).val();
        if (goodsId == purchase_goodsId) {
            flag = true;
        }
    });
    return flag;
}

//填充站点信息
function fillGoodsInfo(purchaseGoodsRowNo, $choiseGoods) {
    var $ele_tr = $("#purchase_goods_list").find("tr").eq(purchaseGoodsRowNo - 1);
    $ele_tr.find("td").eq(1).find("input[type=hidden]").val($choiseGoods.goodsId);
    $ele_tr.find("td").eq(1).find("input[type=text]").val($choiseGoods.goodsName);
    ///*$ele_tr.find("td").eq(2).html($choiseGoods.carLineId);*/
    //$ele_tr.find("td").eq(2).html($choiseGoods.goodsName);
    //$ele_tr.find("td").eq(3).html($choiseGoods.goodsLsNo);
    //$ele_tr.find("td").eq(4).html($choiseGoods.goodsTypeNo);
    //$ele_tr.find("td").eq(5).html($choiseGoods.measurementUnit);
    //$ele_tr.find("td").eq(6).html($choiseGoods.goodsSpell);

}

//移除选择的站点信息
function removeGoodsItem(tdObj) {
    var itemCount = $("#purchase_goods_list").find("tr").length;
    var $ele_tr = $(tdObj).parents("tr:eq(0)");
    if (itemCount == 1) {
        $ele_tr.find("td").eq(1).find("input").val('');
        $ele_tr.find("td").eq(2).find("input").val('');
        $ele_tr.find("td").eq(3).find("input").val('');
        $ele_tr.find("td").eq(4).find("input").val('');
        $ele_tr.find("td").eq(5).find("input").val('');
        //$ele_tr.find("td").eq(6).html('');
        //$ele_tr.find("td").eq(7).html('');
        //$ele_tr.find("td").eq(8).html('');
        //$ele_tr.find("td").eq(9).html('');

    } else {
        $(tdObj).parents("tr").remove();
    }
    $("#purchase_goods_list").find("tr").each(function (i) {
        $(this).find("td").eq(0).html(i + 1);
    });

}

//重置站点选择窗口
function resetSelectGoodsForm() {
    initGoodsTable();
    $("#search-form input").val("");
    $("#search_goods_table input:checkbox").removeAttr("checked");
}

//初始化商品树
function initOrgTree() {
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            dblClickExpand: false
        },
        callback: {
            onClick: function () {
                searchGoods();
            }
        }
    };

    var treeObj = $("#gt_tree");
    var zNodes;

    $.ajax({
        url: ROOT_PATH + '/view/goods/goodsInfo/getMulSubGoodsTypeDataByPcode.action',
        type: 'POST',
        data: {"dictPcode": "AL_POSITION", "dictLevel": 4},
        dataType: 'json',
        success: function (data) {
            zNodes = data;
            $.fn.zTree.init($("#gt_tree"), setting, zNodes);
        }
    });

    treeObj.hover(function () {
        if (!treeObj.hasClass("showIcon")) {
            treeObj.addClass("showIcon");
        }
    }, function () {
        treeObj.removeClass("showIcon");
    });
}


//初始化机构树
function initTree() {
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            dblClickExpand: false
        },
        callback: {
            beforeClick: beforeClick,
            onClick: function (event, treeId, treeNode) {
                $("#orgStrId").val(treeNode.id);
                $("#regionStrId").val(treeNode.pid);
                $("#userPro").val(treeNode.name);
                hideMenu();
            }
        }
    };

    var treeObj = $("#gt1_tree");
    var zNodes;

    $.ajax({
        url: ROOT_PATH + '/view/sys/sysDict/getMulSubDictDataByPcode.action',
        type: 'POST',
        data: {
            "dictPcode": "AL_POSITION",
            "dictLevel": "4"
        },
        dataType: 'json',
        success: function (data) {
            zNodes = data;
            $.fn.zTree.init($("#gt1_tree"), setting, zNodes);
        }
    });

    treeObj.hover(function () {
        if (!treeObj.hasClass("showIcon")) {
            treeObj.addClass("showIcon");
        }
    }, function () {
        treeObj.removeClass("showIcon");
    });
}

function beforeClick(treeId, treeNode) {
    var check = (treeNode && !treeNode.isParent);
    if (!check) alert("只能选择省份...");
    return check;
}
var str = "";
function showMenu() {
    //var menuId = e.id;
    //$("#" + menuId).html('');
    //alert(e.id)
    //$("#agent").val(e.id);
    $.ajax({
        type: "post",
        url: ROOT_PATH + "/view/goods/goodsInfo/getAllGoodsAgent.action",
        data: {
            "dictCode": "DEBT_TYPE"
        },
        success: function (msg) {
            var json = eval("(" + msg + ")");
            //var str = "";
            for (var i = 0; i < json.length; i++) {
                //if (json[i].dictId == 1) {
                //    str = "<option value='" + json[i].dictId + "' selected='selected'>" + json[i].dictName + "</option>";
                //} else {
                var str1 = "<option value='" + json[i].dictId + "'>" + json[i].dictName + "</option>";
                //}
                str = str + str1;
            }
            //alert(str);
            //$("#debtType").append(str);
        },
        error: function (e) {
            console.error("e: ", e);
        }
    });
    //$("body").bind("mousedown", onBodyDown);
}

//批量添加追加行数
function createPurchaseGoodsRow(append_row_no) {
    return '<tr>'
        + '<td class="center">' + append_row_no + '</td>'
        + '<td ><input type="hidden" class="center" name="storageDebtDtlList[' + (append_row_no - 1) + '].goodsId"/><input type="text" class="center" readonly></td>'
        + '<td ><input type="text" class="center" name="storageDebtDtlList[' + (append_row_no - 1) + '].debtGoodsCount" required/></td>'
        + '<td ><select id="' + (append_row_no - 1) + '" name="storageDebtDtlList[' + (append_row_no - 1) + '].debtType"  style="text-align: center; width: 200px"><option value="">请选择</option>' + str + '</select id="' + (append_row_no - 1) + '"></td>'
        + '<td ><input type="text" class="center" style="text-align: center; width: 500px" name="storageDebtDtlList[' + (append_row_no - 1) + '].debtDesc"/></td>'
        + '<td ><input type="hidden" class="center"/>'
        + '<a href="javascript:void(0)" onclick="removeGoodsItem(this)">移除</a></td>'
        + '</tr>';
}

function hideMenu() {
    $("#gt_combobox").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}

//初始化处理类型树
function initTypeTree() {
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            dblClickExpand: false
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                var id = $("#agent").val();
                $("#" + id).val(treeNode.name);
                $("#agent" + id).val(treeNode.id);
                hideUnitMenu();
            }
        }
    };

    var treeObj = $("#agent_tree");
    var zNodes;

    $.ajax({
        url: ROOT_PATH + '/view/inventory/storageDebt/getMulSubGoodsDebtDataByPcode.action',
        type: 'POST',
        data: {"dictPcode": "DEBT_TYPE", "dictLevel": 3},
        dataType: 'json',
        success: function (data) {
            zNodes = data;
            $.fn.zTree.init($("#agent_tree"), setting, zNodes);
        }
    });

    treeObj.hover(function () {
        if (!treeObj.hasClass("showIcon")) {
            treeObj.addClass("showIcon");
        }
    }, function () {
        treeObj.removeClass("showIcon");
    });
}

function hideUnitMenu() {
    $("#agent_combobox").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}

//$("#save").click(function () {
//    //var check = checkTable($("#debtList"));
//    if (checkTable($("#debtList"))) {
//        $(this).submit();
//    } else {
//        return false;
//    }
//});
//
////表单检查
//function checkTable($table) {
//    if ($("tbody tr", $table).html()) {
//        var check = true;
//        $("tbody tr", $table).each(function (index, element) {
//            //trString = '{';
//            $(":text", $(this)).each(function (indexTd, element) {
//                if ($(this).val()) {
//                    //trString += '"' + this.name + '":"' + $(this).val() + '",';
//                } else {
//                    alert('第' + (index + 1) + '行，第' + (indexTd + 1) + '列的值为空，请输入！');
//                    //trString = '';
//                    check = false;
//                    return false;
//                }
//            });
//            if (check == false) {
//                return false;
//            }
//        });
//        return check;
//    }
//}