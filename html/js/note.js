var dataBase;
var noteHtml;
var color = ["#9aaf297a", "#29af9099", "#98d54c", "#d5c0d0", "#d5a651", "#ff14ac00", "#d587d3", "#d5a5bb", "#3dd500", "#d55e67", "#ff587f", "#1cd5d1", "#d59a9a"];
/*随机获取一个RGB*/
var rgb = color[Math.floor(Math.random() * color.length)];
// Bootstrap弹出框（Popover）插件 不能用与 js追加到页面的数据
// $(function () {
//     $("[data-toggle='popover']").popover();
// });
$(function () {
    noteHtml = document.getElementById("notes");
    dataBase = openDatabase("base", "1.0", "便签库", 2 * 1024 * 1024, function () {
    });
    /*deleteDatebase();*/

    dataBase.transaction(function (tx) {
        var date = new Date();
        tx.executeSql('create table if not exists note (id  INTEGER PRIMARY KEY ASC,title VARCHAR, content TEXT,background VARCHAR,is_finish tinyint,create_time date,update_time date)');
        tx.executeSql('SELECT * FROM note', [], function (tx, results) {
            var len = results.rows.length;
            if (len === 0) {
                tx.executeSql('INSERT INTO note (title,content,is_finish,background,create_time,update_time) VALUES ("作为便签，我好像有点优秀","我是一个便签工具,添加在右下角,其他基本功能自己摸索,可以尽情使用,如有建议 email:1585056329@qq.com 🌹🌹🌹",0,"rgba(9, 224, 252, 0.61)","' + getNowFormatDate() + '",DATETIME())');
                // tx.executeSql('INSERT INTO note (title,content,is_finish,background,create_time,update_time) VALUES ("移动设备优先","在 Bootstrap 2 中，我们对框架中的某些关键部分增加了对移动设备友好的样式。而在 Bootstrap 3中，我们重写了整个框架，使其一开始就是对移动设备友好的。这次不是简单的增……",0,"' + color[Math.floor(Math.random() * color.length)] + '",DATETIME(),DATETIME())');
                // tx.executeSql('INSERT INTO note (title,content,is_finish,background,create_time,update_time) VALUES ("排版与链接","Bootstrap 排版、链接样式设置了基本的全局样式。分别是： 为 body 元素设置 background-color: #fff; 使用@font-family-base、@font-size-base 和……。",0,"' + color[Math.floor(Math.random() * color.length)] + '",DATETIME(),DATETIME())');
                // tx.executeSql('INSERT INTO note (title,content,is_finish,background,create_time,update_time) VALUES ("Normalize.css","为了增强跨浏览器表现的一致性，我们使用了 Normalize.css，这是由 Nicolas Gallagher 和 Jonathan Neal 维护的一个CSS 重置样式库。",0,"#14ff51",DATETIME(),DATETIME())');
                // tx.executeSql('INSERT INTO note (title,content,is_finish,background,create_time,update_time) VALUES ("布局容器","Bootstrap 需要为页面内容和栅格系统包裹一个 .container 容器。我们提供了两个作此用处的类。注意，由于 padding 等属性的原因，这两种容器类不能互相嵌套。",0,"#ff14ac00",DATETIME(),DATETIME())');
                // tx.executeSql('INSERT INTO note (title,content,is_finish,background,create_time,update_time) VALUES ("栅格系统","Bootstrap 提供了一套响应式、移动设备优先的流式栅格系统，随着屏幕或视口（viewport）尺寸的增加，系统会自动分为最多12列。它包含了易于使用的预定义类，还有强大的mixin用于生成更具语义的布局。",0,"#8fe3ff",DATETIME(),DATETIME())');
            }
            forEach()
        });
    });
});

function addNote() {
    var title = $("input[name='title']").val();
    var content = $("textarea[name='content']").val();
    if (title === '' || content === '') {
        $('#addModal').modal('hide');
        return;
    }
    var background = $("input[name='background']").val();
    if (background === '') {
        background = color[Math.floor(Math.random() * color.length)]
    }
    dataBase.transaction(function (tx) {
        tx.executeSql('INSERT INTO note (title,content,is_finish,background,create_time,update_time) VALUES ("' + title + '","' + content + '",0,"' + background + '","' + getNowFormatDate() + '",DATETIME())');
    });
    clearInput();
    forEach();
    $('#addModal').modal('hide');
}

function showEditModel(id) {
    dataBase.transaction(function (tx) {
        tx.executeSql('SELECT * FROM note where id=' + id, [], function (tx, results) {
            if (results.rows.length === 0) {
                return;
            }
            $("input[name='u-id']").val(results.rows.item(0).id);
            $("input[name='u-title']").val(results.rows.item(0).title);
            $("textarea[name='u-content']").val(results.rows.item(0).content);
            $("input[name='u-background']").val(results.rows.item(0).background);
            // $("input[name='u-background']").css('color', results.rows.item(0).background)   //显示文字颜色
            $('#u-color').colorpicker("setValue", results.rows.item(0).background); //更新颜色选择器颜色
            $('#editModal').modal();
        }, null);
    });
}

function editNote() {
    var id = $("input[name='u-id']").val();
    var title = $("input[name='u-title']").val();
    var content = $("textarea[name='u-content']").val();
    if (title === '' || content === '') {
        $('#addModal').modal('hide');
        return;
    }
    var background = $("input[name='u-background']").val();
    if (background === '') {
        background = color[Math.floor(Math.random() * color.length)]
    }
    dataBase.transaction(function (tx) {
        tx.executeSql('update note set title="' + title + '",content="' + content + '",background="' + background + '",update_time=DATETIME() where id=' + id);
    });
    forEach();
    $('#editModal').modal('hide');
}

function clearInput() {
    $("input[name='title']").val('');
    $("textarea[name='content']").val('');
}

function deleteNote(id) {
    dataBase.transaction(function (tx) {
        tx.executeSql('delete from note where id=' + id);
    });
    forEach();
}

function showDetail(id) {
    dataBase.transaction(function (tx) {
        tx.executeSql('SELECT * FROM note where id=' + id, [], function (tx, results) {
            if (results.rows.length === 0) {
                return;
            }
            $("h3[data-name='s-title']").html(results.rows.item(0).title);
            $("p[data-name='s-content']").html(results.rows.item(0).content.replace(/\r\n/g, '<br/>').replace(/\n/g, "<br/>"));
            // $(".s-title").html(results.rows.item(0).title);
            // $(".s-content").html(results.rows.item(0).content);
            // $("input[name='u-background']").val(results.rows.item(0).background);
            // $("input[name='u-background']").css('color', results.rows.item(0).background)   //显示文字颜色

            //修改模态窗口的背景颜色
            $(".md-overlay").css("background", results.rows.item(0).background);
            $(".md-content").css("color","#000");
            $(".md-content").css("background", results.rows.item(0).background);
        }, null);
        $("#modal-19").addClass("md-show");
    });
}

var subContent;

function forEach() {
    noteHtml.innerHTML = "";
    dataBase.transaction(function (tx) {
        tx.executeSql('SELECT * FROM note order by update_time desc', [], function (tx, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++) {
                subContent = results.rows.item(i).content.replace(/\r\n/g, '<br/>').replace(/\n/g, "<br/>");
                /*if (screen && screen.width > 480) {
                    if (new Blob([subContent]).size>=280){
                        subContent = results.rows.item(i).content.substring(0,139)+"&nbsp;……";
                    }
                }else {
                    if (new Blob([subContent]).size>=320){
                        subContent = results.rows.item(i).content.substring(0,100)+"&nbsp;……";
                    }
                }*/
                noteHtml.innerHTML = noteHtml.innerHTML + ("<li><div style=\"background:" + results.rows.item(i).background + ";overflow-y:auto\"><small>" + results.rows.item(i).create_time + "</small><h4>" + results.rows.item(i).title + "</h4><p title=\"" + results.rows.item(i).content + "\">" + subContent + "</p><a class=\"md-trigger\" data-modal=\"modal-19\" href=\"javascript:showDetail(" + results.rows.item(i).id + ")\"><i class=\"m-l-n-xxl fa fa-eye\"></i></a><a href=\"javascript:showEditModel(" + results.rows.item(i).id + ");\"><i class=\"m-l-n-lg fa fa-pencil\"></i></a><a href=\"javascript:deleteNote(" + results.rows.item(i).id + ");\"><i class=\"fa fa-trash-o\"></i></a>\</div></li>");
            }

        }, null);
    });
}

function deleteDatebase() {
    dataBase.transaction(function (tx) {
        tx.executeSql('drop table note');
    });
}
//colorpicker 初始化
$(function () {
    $('#color').colorpicker();
});

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

/*function showAddFrame() {
    $('#addModal').modal({})
    // $('#addModal').modal('hide');
}*/

function isfullScreen() {
    var hasClass = $('#fullScreen').hasClass("glyphicon-fullscreen");
    if (hasClass) {
        fullScreen();
    } else {
        exitScreen();
    }
}

//全屏
function fullScreen() {
    // glyphicon glyphicon-plus-sign
    $('#fullScreen').removeClass('glyphicon-fullscreen');
    $('#fullScreen').addClass('glyphicon-zoom-out');

    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (typeof rfs !== "undefined" && rfs) {
        rfs.call(el);
    }
}

//退出全屏
function exitScreen() {
    $('#fullScreen').removeClass('glyphicon-zoom-out');
    $('#fullScreen').addClass('glyphicon-fullscreen');
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
    }
}
