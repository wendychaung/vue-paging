//全局变量 true:正式环境,false:生产环境
var isProductEnv =false;
var projectName = "/MusicRealSimulateExamWeb";
var url_getLoginUser,url_changePassword, url_logout;
if(isProductEnv){
    url_getLoginUser="/login/getLoginUser";
    url_changePassword = "/login/modifyPassword";
    url_logout = "/login/logout";
}else{
    url_getLoginUser="../json/getLoginUser.json";
    url_changePassword = "../json/changePassword";
    url_logout = "../json/logout";
}
$(function () {
    var verifyBox = '<div id="verifyPassword" class="alertbar"><div class="alerttitle">修改密码</div> <span class="close" @click="closeVerifyBox"></span>' +
        '<form id="edit-password" action="/room/addRoom" class="alertcont">' +
        '<dl class="normal_block">' +
        '<dd><label class="lab">原密码：</label> <input name="oldPassword" title="" type="password" required="required" v-model="oldPassword"><div class="password-error" style="display:none"><span class="error">密码错误</span></div></dd>' +
        '<dd><label class="lab">新密码：</label> <input name="newPassword" title="" type="password" required="required" v-model="newPassword"><div v-if="!isNewPasswordValid"><span class="error">新密码不能与原密码一样</span></div></dd>' +
        '<dd><label class="lab">确认密码：</label> <input name="confirmPassword" title="" type="password" required="required" v-model="confirmPassword"><div v-if="!isConfirmPasswordValid"><span class="error">两次密码不一致</span></div></dd>' +
        '</dl>' +
        '<div class="alertbtn"><a class="confirmbtn" @click="doVerify">确定</a> <a class="cancelbtn" @click="closeVerifyBox">取消</a></div></form></div>';
    var header_tem = '<header>' +
        verifyBox +
        '<div class="header"><div class="logo"><img src="/music/images/logo.png" alt=""></div>' +
        '<div class="login">' +
        '<span class="photo">当前用户：{{userName}}</span>|<a class="password" @click="openVerifyBox">修改密码</a>|<a href="#" @click="logout">退出</a>' +
        '</div></div>' +
        '<div class="banner">' +
        '<div>' +
        '<div class="port"></div>' +
        '<div class="ul">' +
        '</div></div></div></header>';
    var footer_tem = '<footer><div class="footerLogo"><img src="/music/images/footer-icon.png" alt=""></div><div>Copyright © 2017-2021 天津讯飞信息科技有限公司</div></footer>';
    Vue.component('vheader', {

        data: function () {
            return {
                userName: "",
                userId:"",
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
                isNewPasswordValid: true,
                isConfirmPasswordValid: true
            }
        },
        template: header_tem,
        watch: {
            oldPassword: function(val){
                if(val != ""){
                    if (this.newPassword == val) {
                        this.isNewPasswordValid = false;
                    } else {
                        this.isNewPasswordValid = true;
                    }
                }else{
                    this.isNewPasswordValid = false;
                }
            },
            newPassword: function(val){
                if(val != "") {
                    if (this.oldPassword == val) {
                        this.isNewPasswordValid = false;
                    } else {
                        this.isNewPasswordValid = true;
                    }

                    if (this.confirmPassword != val) {
                        this.isConfirmPasswordValid = false;
                    } else {
                        this.isConfirmPasswordValid = true;
                    }

                }else{
                    this.isNewPasswordValid = false;
                }
            },
            confirmPassword: function(val){
                if(val != "") {
                    if (this.newPassword != val) {
                        this.isConfirmPasswordValid = false;
                    } else {
                        this.isConfirmPasswordValid = true;
                    }
                }else{
                    this.isConfirmPasswordValid = false;
                }
            }
        },
        mounted: function () {
            this.ajaxUserInfo();
            var url = document.location.toString(), docU = "";
            if (url.indexOf("/") != -1) {
                url = url.substring(0, url.lastIndexOf("/"));
                docU = url.split("/")[url.split("/").length - 1]
            }
            switch (docU) {
                case "a":
                    $(".port").html("平台端入口");
                    $(".ul").append('<a href="plat_training.html"><span>培训机构管理</span></a><a href="plat_examination.html"><span>考场管理</span></a><a href="plat_test.html"><span>试卷管理</span></a><a href="plat_income.html"><span>收入报表</span></a><a href="plat_expenditure.html"><span>支出报表</span></a>');
                    break;
                case "t":
                    $(".port").html("教师端入口");
                    $(".ul").append('<a href="teacher_exam.html"><span>考试管理</span></a><a href="teacher_student.html"><span>学生管理</span></a><a href="teacher_test.html"><span>试卷管理</span></a>');
                    break;
                case "o":
                    $(".port").html("培训机构端入口");
                    $(".ul").append('<a href="training_exam.html"><span>考试管理</span></a><a href="training_teacher.html"><span>教师管理</span></a><a href="training_class.html"><span>班级管理</span></a><a href="training_student.html"><span>学生列表</span></a><a href="training_test.html"><span>试卷管理</span></a><a href="training_income.html"><span>收入报表</span></a>');
                    break;
            }
            var str = $(".breadcrumb").find("a").eq(0).html();
            $(".ul").find("a").find("span").each(function () {
                if (str == $(this).html()) {
                    $(this).parent("a").addClass("selected")
                }
            });
            if (str != "考试管理" && str != "培训机构管理") {
                $('body').animate({scrollTop: 285}, 500);
            } else if (str == "考试管理" || str == "培训机构管理") {
                if ($(".breadcrumb").find("span").length > 0) {
                    $('body').animate({scrollTop: 285}, 500);
                }

            }
            resizeWin();
        },
        methods: {
            ajaxUserInfo: function () {
                var vtm = this;
                $.ajax({
                    url: url_getLoginUser,
                    type: "get",
                    dataType: 'json'
                }).done(function (data) {
                    if (data.result == "true") {
                        vtm.userName = data.data.name;
                        vtm.userId = data.data.id;
                    }
                });
            },
            openVerifyBox: function () {
                $("#verifyPassword").show();
                if($(".mask").length <= 0) {
                    $("body").prepend("<div class='mask'></div>");
                }
                $(".mask").show();
            },
            closeVerifyBox: function () {
                this.oldPassword = "";
                this.newPassword = "";
                this.confirmPassword = "";
                this.isNewPasswordValid = true;
                this.isConfirmPasswordValid = true;
                $("#verifyPassword").hide();
                $(".mask").hide();
            },
            doVerify: function () {
                var vm = this;
                if(vm.oldPassword.trim() == "" || vm.newPassword.trim() == ""){
                    vm.isNewPasswordValid = false;
                }
                if(vm.confirmPassword.trim() == ""){
                    vm.isConfirmPasswordValid = false;
                }
                if(!vm.isNewPasswordValid || !vm.isConfirmPasswordValid){
                    return;
                }
                var userInfo = {
                    userid:vm.userId,
                    password:vm.oldPassword,
                    newPassword:vm.newPassword,
                    confirmPassword:vm.confirmPassword
                };
                $.ajax({
                    url: url_changePassword,
                    type: 'POST',
                    dataType: 'json',
                    data:userInfo
                }).done(function(data){
                    if(data.result == "true"){
                        $("#verifyPassword").find(".alertbtn").append("<div class='success' style='color:green;width:100%;text-align:center;margin-top:15px;position:absolute;'>修改成功！窗口将在3秒后关闭</div>");
                        setTimeout(function(){
                            $("#verifyPassword").find(".success").remove();
                            vm.closeVerifyBox();
                        },3000);
                    }else{
                        $(".password-error").show();
                    }
                });

            },
			logout: function(){
				$.ajax({
					url : url_logout,
					type : "get",
					dataType : 'json'
				}).done(function(data){
					if(data.status == "true"){
						window.location.href = data.url;
					}
				});
			}
        }
    });
    Vue.component('vfooter', {
        template: footer_tem
    });

    var confirm_tem = '<div class="alertbar2 noshow" :id="temid">' +
        '<div class="head">' +
        '<img src="/music/images/bulb.png" alt=""/>' +
        '</div>' +
        '<section>' +
        '<div class="bigtitle">温馨提示</div>' +
        '<div class="secondtitle">是否确定{{msgzero}}{{msgfirst}}{{msgsecond}}？</div>' +
        '<form id="removeform">' +
        '<div class="alertbtn">' +
        '<a class="confirmbtn" @click="subconfirm">确定</a>' +
        '<a class="cancelbtn" @click="subcancel">取消</a>' +
        '</div>' +
        '</form>' +
        '</section>' +
        '</div>';
    Vue.component('v-confirmwin', {
        template: confirm_tem,
        data: function () {
            return {
                //msg1: "",
                //msg2: ""
            }
        },
        props: ['msgzero','msgfirst', 'msgsecond', 'temid'],
        methods: {
            subconfirm: function () {
                this.$emit("subconfirm");
            },
            subcancel: function () {
                this.$emit("subcancel");
            }
        }
    });


    Vue.component('v-selectbox', {
        props: ['options', 'value'],
        template: '<select>' +
        '<slot></slot>' +
        '</select>',
        mounted: function () {
            var vm = this;
            $(this.$el)
                .val(this.value)
                .selectBox()
                .selectBox('options', this.options)
                // emit event on change.
                .on('change', function () {
                    $(this.$el).selectBox().selectBox('value', this.value);
                    vm.$emit('input', this.value);
                });
        },
        watch: {
            value: function (value) {
                $(this.$el)
                    .val(value);
                if (value == null || value == "") {
                    $(this.$el).selectBox()
                        .selectBox('options', this.options);
                }
                // update value
                $(this.$el).selectBox().selectBox('value', this.value);
            },
            options: function (options) {
                // update options
                $(this.$el).selectBox().selectBox('options', options);
            }
        },
        destroyed: function () {
            $(this.$el).off().selectBox('destroy')
        }
    });
});
//获取url参数
function GetRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function resizeWin(){
    // 修改弹窗位置
    $(".alertbar").each(function () {
        var $this = $(this),
            width = $(window).width(),
            height = $(window).height(),
            win_width = $this.width(),
            win_height = $this.height();
        $this.css({
            "marginTop": -win_height / 2 + 'px',
            "marginLeft": -win_width / 2 + 'px'
        });
    });
    $(".alertbar2").each(function () {
        var $this = $(this),
            width = $(window).width(),
            height = $(window).height(),
            win_width = $this.width(),
            win_height = $this.height();
        $this.css({
            "marginTop": -win_height / 2 + 'px',
            "marginLeft": -win_width / 2 + 'px'
        });
    });
}
function errorBox(message, type) {
    var imgName = (type == "error" ? "iconsError" : "iconsTrue"),
        titleCont = (type == "error" ? "错误提示" : "操作成功");
    $("body").append('<div class="alertbar2 Jalert" ><div class="head type_' + type + '"><img src="/music/images/' + imgName + '.png" alt=""/></div><section><div class="bigtitle type_' + type + '">' + titleCont + '</div><div class="secondtitle Jdata">' + message + '</div><div class="alertbtn"><button class="confirmbtn confirmRefresh" >确定</button></div></section></div><div class="mask"></div>');
    $(".Jalert,.mask").show();
    $(".confirmRefresh").click(function () {
        location.reload();
    });
    resizeWin();
}