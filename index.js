window.onload = function () {
    document.getElementsByTagName("mdui-card")[0].style.visibility = "unset"
    document.querySelector("body > mdui-layout > mdui-top-app-bar > mdui-top-app-bar-title").innerText = "刻晴自定义5.8"
}

const tip1 = "没有配置 请先点击管理配置新建配置"
const tip2 = "没有配置 请先新建配置"
const tip3 = "导入成功 请自行保存方案"
const tip4 = "请输入想要修改的方案名"
const tip5 = "你必须要选择一个方案"

if (localStorage.getItem("gamemode")) {
    document.getElementsByTagName("mdui-segmented-button-group")[0].value = localStorage.getItem("gamemode")
} else {
    document.getElementsByTagName("mdui-segmented-button-group")[0].value = "zsf"
}

if (localStorage.getItem("mapmode")) {
    document.querySelectorAll(".myedit")[0].value = localStorage.getItem("mapmode")
}

if (localStorage.getItem("banheros")) {
    if (localStorage.getItem("custom_heros")) {
        var heros_json = JSON.parse(localStorage.getItem("custom_heros"))
        for (item in heros_json) {
            if (item == localStorage.getItem("banheros")) {
                document.querySelectorAll(".myedit")[1].value = localStorage.getItem("banheros")
            }
        }
    }
}

if (localStorage.getItem("customs")) {
    document.querySelectorAll(".myedit")[2].value = localStorage.getItem("customs")
}

if (localStorage.getItem("wzzdy_mycustomthemecolor")) {
    document.getElementsByClassName("color-custom")[0].value = localStorage.getItem("wzzdy_mycustomthemecolor")
}

var allbutton = document.querySelectorAll(".mybutton")
var work_message = "null"

function 打开链接(url) {
    var zsfappsdk = "tencentmsdk1104466820://"
    if (navigator.userAgent.indexOf("QQ/") !== -1) {
        //正式服
        if (url.includes(zsfappsdk)) {
            url = url.replace(new RegExp(zsfappsdk, 'g'), 'https://h5.nes.smoba.qq.com/pvpesport.web.user/#/launch-game-mp-qq');
        }
    }
    window.location.href = url
    mdui_snackbar({
        message: "启动成功 如没反应请检查是否安装相关应用或尝试在浏览器打开",
        action: "我知道了",
        onActionClick: () => console.log("click action button")
    });
}

function checkGameMode(modeName, serverType) {
    const maptip1 = "当前地图模式暂时未开启 请重新选择"
    const maptip2 = "当前地图模式只在星期五到星期天开放 请重新选择"
    const maptip3 = "当前地图模式暂时只在正式服开启 请重新选择"
    const maptip4 = "当前地图模式暂时只在体验服开启 请重新选择"
    const maptip5 = "当前地图模式在『快捷房间』里开启 请重新选择"


    /*
    //暂时没用的
    if (serverType === 'tyf' && modeName.includes("5v5") != true) {
        mdui.alert({
            headline: "提示",
            description: "体验服暂时只支持5v5类型的自定义房间 其他模式已被和谐 请重新选择",
            confirmText: "我知道了",
            onConfirm: () => console.log("confirmed"),
        });
        return true
    }
    */

    const gameModes = [
        {
            keyword: "觉醒",
            isOpen: () => false,
            tip: maptip5,
        },
        {
            keyword: "克隆",
            isOpen: () => [5, 6, 0].includes(new Date().getDay()),
            tip: maptip2,
        },
        {
            keyword: "契约",
            isOpen: () => [5, 6, 0].includes(new Date().getDay()),
            tip: maptip2,
        },
        {
            keyword: "变身",
            isOpen: (serverType) => serverType === 'zsf',
            tip: maptip3,
        },
        {
            keyword: "随机征召",
            isOpen: (serverType) => serverType === 'zsf',
            tip: maptip3,
        },
        {
            keyword: "变身",
            isOpen: (serverType) => serverType === 'tyf',
            tip: maptip4,
        },
    ];

    const matchedMode = gameModes.find((mode) => modeName.includes(mode.keyword));

    if (matchedMode) {
        const isOpen = matchedMode.isOpen(serverType);
        if (!isOpen) {

            mdui.alert({
                headline: "提示",
                description: matchedMode.tip,
                confirmText: "我知道了",
                onConfirm: () => console.log("confirmed"),
            });

            console.log(`${modeName} 已关闭`);
            return true;
        }
        return false;
    } else {
        console.log(`未找到对应的游戏模式：${modeName}`);
        return false;
    }
}

function 生成链接(func) {
    var mode = document.getElementsByTagName("mdui-segmented-button-group")[0].value
    var url
    if (mode == "zsf") {
        url = "tencentmsdk1104466820://?gamedata=SmobaLaunch_"
    } else if (mode == "tyf") {
        url = "tencentmsdk1104791911://?gamedata=SmobaLaunch_"
    } else {
        mdui_snackbar({
            message: "你必须选择一个游戏",
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
        return false
    }

    var alljson = {
        "createType": "2",
        "mapID": "待填入mapid",
        "ullRoomid": "待填入roomid",
        "mapType": "待填入maptype",
        "ullExternUid": "待填入uid",
        "roomName": "1",
        "teamerNum": "待填入人数",
        "platType": "2",
        "campid": "1",
        "AddPos": "0",
        "firstCountDownTime": "待填入时间",
        "secondCountDownTime": "17",
        "AddType": "2",
        "OfflineRelayEntityID": "",
        "openAICommentator": "1",
        //ban英雄
        "banHerosCamp1": [],
        //ban英雄
        "banHerosCamp2": [],
        "customDefineItems": []
    }

    var edittab = document.querySelectorAll(".myedit")
    var mapid = edittab[0].value.replace(/\s+/g, "");

    var modename = mapid


    var custom = edittab[2].value

    var oheros
    var omapid

    if (isJSON(custom)) {
        var custom_json = JSON.parse(custom)
        alljson.customDefineItems = custom_json
    } else if (localStorage.getItem("custom_cof")) {
        var customjson = JSON.parse(localStorage.getItem("custom_cof"))
        if (customjson[edittab[2].value]) {
            var myjson = JSON.parse(customjson[edittab[2].value].myjson)
            console.log(myjson)
            var json_herolist = myjson[0]
            var json_bxlist = myjson[1]
            var json_yglist = myjson[2]
            var json_fytlist = myjson[3]
            var json_sjlist = myjson[4]
            if (customjson[edittab[2].value].myjson) {
                mysjson = customjson[edittab[2].value].adjson
                if (typeof mysjson == "undefined") {
                    mysjson = ["", "", "", ""]
                }
                console.log(mysjson)
                if (mysjson[0] != "") {
                    omapid = mysjson[0]
                }
                if (mysjson[1] != "") {
                    oheros = mysjson[1]
                }
            }
            try {
                var custom_json = makejson(json_herolist, json_bxlist, json_yglist, json_fytlist, json_sjlist, mysjson)
            } catch (error) {
                console.log(error)
                mdui.alert({
                    headline: "提示",
                    description: "合成自定义配置时出错 错误信息(可自己查看或发送给作者3465221490):" + error,
                    confirmText: "我知道了",
                });
                return
            }
            alljson.customDefineItems = custom_json
        }
    }

    if (omapid) {
        mapid = omapid
    }

    if (isNaN(mapid)) {
        mapid = mydatajson[0][mapid]
    } else {
        mdui.alert({
            headline: "提示",
            description: "地图模式获取失败 请选择地图模式名称后重新尝试",
            confirmText: "我知道了",
            onConfirm: () => console.log("confirmed"),
        });
        return
    }

    console.log(mapid)

    alljson.mapID = mapid[0]
    alljson.mapType = mapid[1]
    alljson.teamerNum = mapid[2]

    if (checkGameMode(modename, mode)) {
        return
    }

    if (alljson.mapType != 1) {
        var myalljson = {
            "createType": "2",
            "mapID": "待填入mapid",
            "ullRoomid": "待填入roomid",
            "mapType": "待填入roomid",
            "ullExternUid": "待填入roomid",
            "roomName": "1",
            "platType": "1",
            "campid": "1",
            "AddPos": "0",
            "AddType": "2"
        }

        myalljson.mapID = mapid[0]
        myalljson.mapType = mapid[1]

        var Rand = Math.random()
        var mineId = Math.round(Rand * 1000000000000000000)

        myalljson.ullExternUid = mineId
        myalljson.ullRoomid = mineId

        var alljson_str = JSON.stringify(myalljson)
        console.log(alljson_str)
        var openurl = url + btoa(alljson_str)
        var tiptext = "此地图仅提供开房间，不可无CD哦 确认启动？"

        if (func) {
            func(openurl, tiptext)
            return
        }

        mdui.confirm({
            headline: "提示",
            description: tiptext,
            confirmText: "继续",
            cancelText: "取消",
            onConfirm: () => {
                window.openurl = openurl
                打开链接(openurl)
            },
            onCancel: () => console.log("canceled"),
        });

        window.myheros = "无禁用英雄"

        return

    }


    var heros = edittab[1].value.replace(/\s+/g, "");

    if (localStorage.getItem("custom_heros")) {
        var herojson = JSON.parse(localStorage.getItem("custom_heros"))
        if (herojson[edittab[1].value]) {
            heros = herojson[edittab[1].value]
        }
    }

    if (oheros) {
        heros = oheros
    }

    const banheros = []

    for (item in mydatajson[1]) {
        if (heros.includes(item)) {
            //提取json内容中第一个|前的内容
            var hero = mydatajson[1][item].split('|')[0]
            banheros.push(hero)
        }
    }

    if (banheros.length == 0) {
        window.myheros = "无禁用英雄"
    } else {
        window.myheros = heros
        alljson.banHerosCamp1 = banheros
        alljson.banHerosCamp2 = banheros
    }



    alljson.firstCountDownTime = "6666666666"

    var Rand = Math.random()
    var mineId = Math.round(Rand * 1000000000000000000)

    alljson.ullExternUid = mineId
    alljson.ullRoomid = mineId

    console.log(alljson)

    var alljson_str = JSON.stringify(alljson)
    console.log(alljson_str)
    var openurl = url + btoa(alljson_str)
    var tiptext = "确认启动？"

    if (Object.keys(alljson.customDefineItems).length == 0) {
        tiptext = "检测到自定义配置为空 是否继续"
    }

    if (func) {
        func(openurl, tiptext)
        return
    }

    mdui.confirm({
        headline: "提示",
        description: tiptext,
        confirmText: "继续",
        cancelText: "取消",
        onConfirm: () => {
            window.openurl = openurl
            打开链接(openurl)
        },
        onCancel: () => console.log("canceled"),
    });

}

function processLink(link) {
    // 截取内容
    const afterDomain = link.split('//aiu.pub/')[1];
    // 将所有 / 替换为.
    const replacedContent = afterDomain.replace(/\//g, ".");
    return replacedContent;
}

//从 https://api.aa1.cn/ 找的api链接
function getShortLink(longUrl) {
    const requestUrl = `https://aiu.pub/api/link?url=${encodeURIComponent(longUrl)}`;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", requestUrl, true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                const response = JSON.parse(this.responseText);
                resolve(response.data);
            } else {
                reject(new Error(`HTTP error! status: ${this.status}`));
            }
        };
        xhr.onerror = function () {
            reject(new Error("Network error"));
        };
        xhr.send();
    });
}

var newDiv = document.createElement('div');

var links = [
    { text: '王者荣耀擂台赛游戏交流群：570624408', url: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=7uSr0e6-DUQ7pP_OMSxHxYN-t1W9_bkE&authKey=2CWTOBT1KPX5KizT%2BgENm8n5iO7pO5RxiN9u5vQGpdX1%2BDljmgqKV9eAk5aLynHJ&noverify=0&group_code=570624408' },
    { text: '不醒人室②群：836247238', url: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=AeU27m-5sza6JRjkMLCO-biB5yGG3w3j&authKey=sMzY30zSy2WMJ0oMBIRlu3iKXKWDHLge%2BVslCFUhEZAhUKE%2BwhVQyRor62jDgQ56&noverify=0&group_code=836247238' },
    { text: '不醒人室③群：955174989', url: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=pz4LFDPV9OgSIdWfI1iZc4MW1JKBW46c&authKey=%2ByU0vz6MiFT2wqxEIydZElZvQyHorYjRv%2FsFH%2BnHxXgRctV9yAjT0XCWms0n4DL4&noverify=0&group_code=955174989' },
    { text: '不醒人室总群：973202403', url: 'https://static.gamecenter.qq.com/social-web/sop-personal-group-join/index.html?&appid=102106122&groupID=616860952&tag=4' }
];

links.forEach(function (link) {
    var a = document.createElement('a');
    a.textContent = link.text;
    a.href = link.url;
    a.target = '_blank';
    a.style.color = 'rgb(var(--mdui-color-primary))';

    newDiv.appendChild(a);
    newDiv.appendChild(document.createElement('br'));
});
var span = document.createElement('span');
// 设置<span>元素的文本内容  
span.innerHTML = '<span slot="description"><h3 style="color:red">源码出售！！</h3><br>出售本网站全套最新源码<br>全套包更新！<br>进群咨询详情，首推加①群<br>点击确定则随机添加群聊</span>';
mdui.dialog({

    headline: "源码出售中...",
    description: span,
    actions: [
        {
            text: "确认",
            onClick: function () {
                var randomIndex = Math.floor(Math.random() * links.length);
                window.open(links[randomIndex].url, '_blank');
                return false;
            }
        },
        {
            text: "关闭",
        }
    ],
    body: newDiv
});

allbutton[0].onclick = function () {
    if (work_message != "null") {
        mdui_snackbar({
            message: work_message,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
        return
    }
    生成链接()
}


allbutton[1].onclick = function () {
    if (work_message != "null") {
        mdui_snackbar({
            message: work_message,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
        return;
    }

    if (window.openurl) {
        var openurl = window.openurl;
        getShortLink(window.location.origin + "/Smoba.html?data=" + openurl)
            .then(shortLink => {
                murl = processLink(shortLink);
                work_message = "null";

                // 创建span元素用于显示二维码
                var span = document.createElement('span');
                span.innerHTML = '<span slot="description"><img src="https://api.gumengya.com/Api/QrCode?text=' + window.location.origin + "/data.html?" + murl + '" alt="QR Code" style="width: 100%; height: 100%;"></span>';

                // 显示二维码
                mdui.confirm({
                    headline: "当前房间",
                    description: span,
                    confirmText: "我知道了",
                    onConfirm: () => console.log("confirmed"),
                });
            })
            .catch(error => {
                work_message = "null";
                mdui.alert({
                    headline: "提示",
                    description: "出现错误 无法请求 请检查网络",
                    confirmText: "我知道了",
                    onConfirm: () => console.log("confirmed"),
                });
                console.log(error);
            });
    } else {
        // 生成链接并获取短链接
        生成链接(function (openurl, tiptext) {
            getShortLink(window.location.origin + "/Smoba.html?data=" + openurl)
                .then(shortLink => {
                    murl = processLink(shortLink);
                    work_message = "null";

                    // 创建span元素用于显示二维码
                    var span = document.createElement('span');
                    span.innerHTML = '<span slot="description"><img src="https://api.gumengya.com/Api/QrCode?text=' + window.location.origin + "/data.html?" + murl + '" alt="QR Code" style="width: 100%; height: 100%;"></span>';

                    // 显示二维码
                    mdui.confirm({
                        headline: "当前房间二维码\n如有需要\n请自行截图保存\n点击确定将复制房间链接",
                        description: span,
                        confirmText: "确认",
                        cancelText: "关闭",
                        onCancel: () => console.log("canceled"),
                        onConfirm: () => {
                            复制文本("🈲该链接禁用英雄：" + "\n" + myheros + "\n" + "🔗 点击下方链接加入房间" + "\n" + window.location.origin + "/data.html?" + murl + " ©刻晴自定义");
                            打开链接(openurl);
                        },
                    });
                })
                .catch(error => {
                    work_message = "null";
                    mdui.alert({
                        headline: "提示",
                        description: "出现错误 无法请求 请检查网络",
                        confirmText: "我知道了",
                        onConfirm: () => console.log("confirmed"),
                    });
                    console.log(error);
                });
        });
    }
}



allbutton[2].onclick = function () {
    // 创建<span>元素  
    var span = document.createElement('span');
    // 设置<span>元素的文本内容  
    span.innerHTML = '<span slot="description"><h5 style="Color:skyblue">更新于：2024-07-23 20:06:25</p><h3 style="color:red">5.8更新内容:</h3>1.更换了接口，优化复制链接和加入房间的加载速度<h3 style="color:red">5.7更新内容:</h3>1.禁用英雄列表加入头像显示，方便选择<h3 style="color:red">5.6更新内容:</h3></p>1.增加生成二维码功能，请自行截图或长按保存二维码<br>2.禁用英雄管理配置里面新增随机禁用按钮<br>3.快捷房间里面增加随机参数玩法，99CD其余参数未知并且双方随机禁用英雄，未知的，才刺激！<br>4.解决无法复制链接问题<br>5.解决快捷房间按钮需要点两次问题<h3 style="color:red">5.5更新内容:</h3></p>1.解决链接加入房间超时问题<h3 style="color:red">5.4更新内容:</h3></p>1.增加10V10可邀请创房，直接点击『众星峡谷』按钮创建<br>2.网站底部增加版权声明，本网站严禁倒卖！<br>作者有话说：死人山海扒你跌源码拿去倒卖还改不干净，反馈套个空壳真有意思。又要扒我源码还禁用我链接，你真的是喜欢逗人笑，老子真是看不起你。<h3 style="color:red">5.3更新内容:</h3></p>1.禁用英雄列表增加元流之子<br>2.提供正式服的10v10众星峡谷开房间<h3 style="color:red">5.2更新内容:</h3></p>1.大改功能布局，把多余的按钮收纳起来<br>2.增加快捷房间，需自己选择地图，请注意：第一次点击快捷房间按钮会储存当前按钮状态，所以没有反应，要点第二次才恢复正常<br>3.优化了赞助页面，顺带解决页中页问题<br>4.增加了一个英雄战力查询功能在更多功能里面<h3 style="color:red">5.1更新内容:</h3></p>1.加入反馈按钮，用户可以直接点开提交反馈<br>2.增加常见问题答疑，点开即可查看<br>3.删除了赞助页面和网站合集中的樱花飘落特效<br>4.删除了网站合集中卡片里的链接显示(因为有时候会超出卡片，作者懒得改所以直接删了，不影响功能使用)<br>5.优化了原繁琐逻辑，把各个按钮从原先的跳转链接改成窗口嵌入式显示<br>6.重新录制了使用教程视频<br>7.优化了加载速度<h3 style="color:red">5.0更新内容:</h3></p>1.网站底部加入数据统计，请各位多多分享本网站！<br><h3 style="color:red">4.9更新内容:</h3></p>1.修改了复制链接的文字内容<br>2.增加众星峡谷地图<br>3.美化了各个页面<br>4.更多链接中加入白芸自定义<h3 style="color:red">4.8更新内容:</h3></p>1.优化美观了加入房间页面<h3 style="color:red">4.7更新内容:</h3></p>1.优化了一下加群功能<br>2.优化分享方案和导入方案功能，该功能在管理配置里面<br><h5 style="Color:red">↑该功能使用方法：<br>①点击分享配置，可以复制当前方案的配置信息，然后把复制到的内容发给别人即可<br>②点击导入配置，粘贴从别人那里复制的配置信息即可，导入后记得保存哦</p></span>';
    mdui.alert({
        headline: "更新内容",
        description: span,
        confirmText: "我已知晓",
        onConfirm: () => console.log("confirmed"),
    });
}

allbutton[3].onclick = function () {
    var span = document.createElement('span');
    // 设置<span>元素的文本内容  
    span.innerHTML = '<span slot="description"><iframe src="https://www.wjx.cn/vm/eD3YYZE.aspx#" width="100%" height="380" frameborder="0"></iframe></span>';
    mdui.alert({
        headline: "意见反馈",
        description: span,
        confirmText: "关闭",
        onConfirm: () => console.log("confirmed"),
    });
}

allbutton[4].onclick = function () {
    var span = document.createElement('span');
    // 设置<span>元素的文本内容
    span.innerHTML = '<span slot="description"><iframe src="https://txmov2.a.kwimgs.com/upic/2024/06/24/13/BMjAyNDA2MjQxMzI1MzdfNzI1MTA0MTE2XzEzNTgyMjY4NTEwNV8yXzM=_b_B6c5dd529189e3b0123711d686e743364.mp4?tag=1-1719206787-std-1-ys7lgs9jdg-091249f88d92f5&clientCacheKey=3xwetx2vc3vdevw_b.mp4&tt=b&di=88cc45f&bp=12681&ali_redirect_ex_hot=66666800&ali_redirect_ex_beacon=1" width="100%" height="380" frameborder="0" autoplay></iframe></span>';
    mdui.alert({
        headline: "视频教程",
        description: span,
        confirmText: "关闭",
        onConfirm: () => console.log("confirmed"),
    });
}
allbutton[5].onclick = function () {
    var span = document.createElement('span');
    // 设置<span>元素的文本内容  
    span.innerHTML = '<span slot="description"><iframe src="https://wzzdy.chiyan.xyz/allweb.html" width="100%" height="380" frameborder="0"></iframe></span>';
    mdui.alert({
        headline: "网站合集",
        description: span,
        confirmText: "关闭",
        onConfirm: () => console.log("confirmed"),
    });
}

allbutton[6].onclick = function () {
    var span = document.createElement('span');
    // 设置<span>元素的文本内容  
    span.innerHTML = '<span slot="description"><iframe src="https://wzzdy.chiyan.xyz/zanz.html" width="100%" height="380" frameborder="0"></iframe></span>';
    mdui.alert({
        headline: "赞助作者",
        description: span,
        confirmText: "关闭",
        onConfirm: () => console.log("confirmed"),
    });
}
allbutton[7].onclick = function () {
    var span = document.createElement('span');
    // 设置<span>元素的文本内容  
    span.innerHTML = '<span slot="description"><iframe src="https://wzzdy.chiyan.xyz/FAQ.html" width="100%" height="380" frameborder="0"></iframe></span>';
    mdui.alert({
        headline: "常见问题",
        description: span,
        confirmText: "关闭",
        onConfirm: () => console.log("confirmed"),
    });
}
allbutton[8].onclick = function () {
    var span = document.createElement('span');
    // 设置<span>元素的文本内容  
    span.innerHTML = '<span slot="description"><iframe src="https://wzzdy.chiyan.xyz/zhanli.html" width="100%" height="380" frameborder="0"></iframe></span>';
    mdui.alert({
        headline: "英雄战力",
        description: span,
        confirmText: "关闭",
        onConfirm: () => console.log("confirmed"),
    });
};

function 合成快捷房间参数(jsons, keys, headline, copytext) {

    if (work_message != "null") {
        mdui_snackbar({
            message: work_message,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
        return
    }

    生成链接(function (openurl, tiptext) {
        let OPENURL = openurl.split("SmobaLaunch_")[0] + "SmobaLaunch_";
        let ASCII = openurl.split("SmobaLaunch_")[1];
        let newjson = JSON.parse(atob(ASCII));

        keys.forEach(key => {
            jsons[key] = newjson[key];
        });

        var jsons_str = JSON.stringify(jsons);
        var openurl = OPENURL + btoa(jsons_str);
        getShortLink(window.location.origin + "/Smoba.html?data=" + openurl)
            .then(shortLink => {
                murl = processLink(shortLink);
                work_message = "null"
                var span = document.createElement('span');
                span.innerHTML = '<span slot="description"><img src="https://api.gumengya.com/Api/QrCode?text=' + window.location.origin + "/data.html?" + murl + '" alt="QR Code" style="width: 100%; height: 100%;"></span>';

                // 显示二维码
                mdui.confirm({
                    headline: headline,
                    description: span,
                    confirmText: "确认",
                    cancelText: "关闭",
                    onCancel: () => console.log("canceled"),
                    onConfirm: () => {
                        copytext = copytext.replace("最后处理链接", window.location.origin + "/data.html?" + murl)
                        复制文本(copytext)
                        打开链接(openurl)
                    },
                    onCancel: () => console.log("canceled"),
                });
            })
            .catch(error => {
                work_message = "null"
                mdui.alert({
                    headline: "提示",
                    description: "出现错误 无法请求 请检查网络",
                    confirmText: "我知道了",
                    onConfirm: () => console.log("confirmed"),
                });
                console.log(error)
            });
    })

}

allbutton[11].onclick = function () {
    let jsons = {
        "createType": "2",
        "mapID": "待填入mapid",
        "ullRoomid": "待填入roomid",
        "mapType": "待填入mapType",
        "ullExternUid": "待填入uid",
        "roomName": "1",
        "teamerNum": "10",
        "platType": "2",
        "campid": "1",
        "AddPos": "0",
        "firstCountDownTime": "0",
        "secondCountDownTime": "0",
        "AddType": "2",
        "OfflineRelayEntityID": "",
        "openAICommentator": "1",
        //ban英雄
        "banHerosCamp1": [],
        //ban英雄
        "banHerosCamp2": [],
        "customDefineItems": [
            "0:6", "51:6", "56:6", "61:6", "66:6", "28:6", "71:6", "76:6", "81:6", "86:6", "3:4", "21:4", "54:4", "91:4", "59:4", "92:4", "64:4", "93:4", "69:4", "94:4", "31:4", "47:4", "74:4", "95:4", "79:4", "96:4", "84:4", "97:4", "89:4", "98:4", "4:4", "55:4", "60:4", "65:4", "70:4", "32:4", "75:4", "80:4", "85:4", "90:4"
        ]
    };
    let keys = ["mapID", "mapType", "ullRoomid", "ullExternUid"]
    let headline = "快捷-不禁英雄无CD 点击确定复制链接"
    let copytext = "🚀快捷房间配置：" + "\n" + "不禁英雄无CD" + "\n" + "🈲该链接禁用英雄：" + "\n" + "无禁用英雄" + "\n" + "🔗 点击下方链接加入房间" + "\n" + "最后处理链接" + " ©刻晴自定义"
    合成快捷房间参数(jsons, keys, headline, copytext)
}
allbutton[12].onclick = function () {
    let jsons = {
        "createType": "2",
        "mapID": "待填入mapid",
        "ullRoomid": "待填入roomid",
        "mapType": "待填入mapType",
        "ullExternUid": "待填入uid",
        "roomName": "1",
        "teamerNum": "10",
        "platType": "2",
        "campid": "1",
        "AddPos": "0",
        "firstCountDownTime": "0",
        "secondCountDownTime": "0",
        "AddType": "2",
        "OfflineRelayEntityID": "",
        "openAICommentator": "1",
        //ban英雄
        "banHerosCamp1": ["121", "123", "131", "141", "173", "176", "125", "505", "506", "564", "514", "519"],
        "banHerosCamp2": ["121", "123", "131", "141", "173", "176", "125", "505", "506", "564", "514", "519"],
        "customDefineItems": ["0:6", "51:6", "56:6", "61:6", "66:6", "28:6", "71:6", "76:6", "81:6", "86:6", "3:4", "21:4", "54:4", "91:4", "59:4", "92:4", "64:4", "93:4", "69:4", "94:4", "31:4", "47:4", "74:4", "95:4", "79:4", "96:4", "84:4", "97:4", "89:4", "98:4", "4:4", "55:4", "60:4", "65:4", "70:4", "32:4", "75:4", "80:4", "85:4", "90:4"
        ]
    };
    let keys = ["mapID", "mapType", "ullRoomid", "ullExternUid"]
    let headline = "快捷-只禁无法选中无CD 点击确定复制链接"
    let copytext = "🚀快捷房间配置：" + "\n" + "只禁无法选中英雄ㅤ无CD" + "\n" + "🈲该链接禁用英雄：" + "\n" + "芈月 吕布 李白 貂蝉 李元芳 杨玉环 元歌 瑶 云中君 姬小满 亚连 敖隐" + "\n" + "🔗 点击下方链接加入房间" + "\n" + "最后处理链接" + " ©刻晴自定义"
    合成快捷房间参数(jsons, keys, headline, copytext)
}

allbutton[13].onclick = function () {
    let jsons = {
        "createType": "2",
        "mapID": "待填入mapid",
        "ullRoomid": "待填入roomid",
        "mapType": "待填入mapType",
        "ullExternUid": "待填入uid",
        "roomName": "1",
        "teamerNum": "10",
        "platType": "2",
        "campid": "1",
        "AddPos": "0",
        "firstCountDownTime": "0",
        "secondCountDownTime": "0",
        "AddType": "2",
        "OfflineRelayEntityID": "",
        "openAICommentator": "1",
        "banHerosCamp1": ["112", "136", "169", "179"],
        "banHerosCamp2": ["112", "136", "169", "179"],
        "customDefineItems": ["0:6", "51:6", "56:6", "61:6", "66:6", "28:6", "71:6", "76:6", "81:6", "86:6", "3:4", "21:4", "54:4", "91:4", "59:4", "92:4", "64:4", "93:4", "69:4", "94:4", "31:4", "47:4", "74:4", "95:4", "79:4", "96:4", "84:4", "97:4", "89:4", "98:4", "4:4", "55:4", "60:4", "65:4", "70:4", "32:4", "75:4", "80:4", "85:4", "90:4"
        ]
    };
    let keys = ["mapID", "mapType", "ullRoomid", "ullExternUid"]
    let headline = "快捷-只禁地图炮 点击确定复制链接"
    let copytext = "🚀快捷房间配置：" + "\n" + "只禁地图炮英雄ㅤ无CD" + "\n" + "🈲该链接禁用英雄：" + "\n" + "鲁班七号 武则天 后羿 女娲" + "\n" + "🔗 点击下方链接加入房间" + "\n" + "最后处理链接" + " ©刻晴自定义"
    合成快捷房间参数(jsons, keys, headline, copytext)
}

allbutton[14].onclick = function () {
    let jsons = {
        "createType": "2",
        "mapID": "待填入mapid",
        "ullRoomid": "待填入roomid",
        "mapType": "待填入mapType",
        "ullExternUid": "待填入uid",
        "roomName": "1",
        "teamerNum": "10",
        "platType": "2",
        "campid": "1",
        "AddPos": "0",
        "firstCountDownTime": "0",
        "secondCountDownTime": "0",
        "AddType": "2",
        "OfflineRelayEntityID": "",
        "openAICommentator": "1",
        "banHerosCamp1": ["121", "123", "131", "141", "173", "176", "125", "505", "506", "564", "514", "519", "112", "136", "169", "179"],
        "banHerosCamp2": ["121", "123", "131", "141", "173", "176", "125", "505", "506", "564", "514", "519", "112", "136", "169", "179"],
        "customDefineItems": ["0:6", "51:6", "56:6", "61:6", "66:6", "28:6", "71:6", "76:6", "81:6", "86:6", "3:4", "21:4", "54:4", "91:4", "59:4", "92:4", "64:4", "93:4", "69:4", "94:4", "31:4", "47:4", "74:4", "95:4", "79:4", "96:4", "84:4", "97:4", "89:4", "98:4", "4:4", "55:4", "60:4", "65:4", "70:4", "32:4", "75:4", "80:4", "85:4", "90:4"
        ]
    };
    let keys = ["mapID", "mapType", "ullRoomid", "ullExternUid"]
    let headline = "快捷-禁用超标英雄 点击确定复制链接"
    let copytext = "🚀快捷房间配置：" + "\n" + "禁用无法选中+地图炮等超标英雄ㅤ无CD" + "\n" + "🈲该链接禁用英雄：" + "\n" + "芈月 吕布 李白 貂蝉 李元芳 杨玉环 元歌 瑶 云中君 姬小满 亚连 敖隐 鲁班七号 武则天 后羿 女娲" + "\n" + "🔗 点击下方链接加入房间" + "\n" + "最后处理链接" + " ©刻晴自定义"
    合成快捷房间参数(jsons, keys, headline, copytext)
}

allbutton[15].onclick = function () {
    let jsons = {
        "createType": "2",
        "mapID": "待填入mapid",
        "ullRoomid": "待填入roomid",
        "mapType": "待填入mapType",
        "ullExternUid": "待填入uid",
        "roomName": "1",
        "teamerNum": "10",
        "platType": "2",
        "campid": "1",
        "AddPos": "0",
        "firstCountDownTime": "0",
        "secondCountDownTime": "0",
        "AddType": "2",
        "OfflineRelayEntityID": "",
        "openAICommentator": "1",
        "banHerosCamp1": ["106", "107", "108", "109", "110", "111", "112", "115", "116", "118", "119", "124", "127", "128", "129", "130", "131", "132", "133", "136", "139", "140", "141", "142", "146", "148", "150", "152", "153", "154", "156", "157", "162", "163", "167", "169", "170", "173", "174", "175", "177", "178", "183", "184", "180", "190", "192", "191", "182", "189", "196", "195", "198", "179", "501", "199", "176", "502", "197", "503", "504", "125", "137", "508", "312", "507", "513", "529", "505", "506", "522", "518", "523", "525", "524", "531", "536", "528", "537", "155", "538", "540", "542", "534", "548", "521", "544", "545", "564", "514", "159", "563", "519", "517"],
        "banHerosCamp2": ["106", "107", "108", "109", "110", "111", "112", "115", "116", "118", "119", "124", "127", "128", "129", "130", "131", "132", "133", "136", "139", "140", "141", "142", "146", "148", "150", "152", "153", "154", "156", "157", "162", "163", "167", "169", "170", "173", "174", "175", "177", "178", "183", "184", "180", "190", "192", "191", "182", "189", "196", "195", "198", "179", "501", "199", "176", "502", "197", "503", "504", "125", "137", "508", "312", "507", "513", "529", "505", "506", "522", "518", "523", "525", "524", "531", "536", "528", "537", "155", "538", "540", "542", "534", "548", "521", "544", "545", "564", "514", "159", "563", "519", "517"],
        "customDefineItems": ["0:6", "51:6", "56:6", "61:6", "66:6", "28:6", "71:6", "76:6", "81:6", "86:6", "1:5", "52:5", "57:5", "62:5", "67:5", "29:5", "72:5", "77:5", "82:5", "87:5", "2:5", "53:5", "58:5", "63:5", "68:5", "30:5", "73:5", "78:5", "83:5", "88:5", "3:3", "21:3", "54:3", "91:3", "59:3", "92:3", "64:3", "93:3", "69:3", "94:3", "31:3", "47:3", "74:3", "95:3", "79:3", "96:3", "84:3", "97:3", "89:3", "98:3", "4:4", "55:4", "60:4", "65:4", "70:4", "32:4", "75:4", "80:4", "85:4", "90:4", "106:3", "107:3", "108:3", "109:3", "110:3", "111:3", "112:3", "113:3", "114:3", "115:3", "5:5", "33:5", "6:5", "34:5", "7:3", "35:3", "8:3", "36:3", "9:1", "37:1", "14:3", "23:3", "42:3", "49:3", "17:3", "45:3"]
    };
    let keys = ["mapID", "mapType", "ullRoomid", "ullExternUid"]
    let headline = "快捷-80CD坦克大战 点击确定复制链接"
    let copytext = "🚀快捷房间配置：" + "\n" + "80CD坦克大战" + "\n" + "🈲该链接禁用英雄：" + "\n" + "小乔 赵云 墨子 妲己...更多禁用英雄请进链接查看" + "\n" + "🔗 点击下方链接加入房间" + "\n" + "最后处理链接" + " ©刻晴自定义"
    合成快捷房间参数(jsons, keys, headline, copytext)
}

allbutton[16].onclick = function () {
    let jsons = {
        "createType": "2",
        "mapID": "待填入mapid",
        "ullRoomid": "待填入roomid",
        "mapType": "待填入mapType",
        "ullExternUid": "待填入uid",
        "roomName": "1",
        "teamerNum": "10",
        "platType": "2",
        "campid": "1",
        "AddPos": "0",
        "firstCountDownTime": "0",
        "secondCountDownTime": "0",
        "AddType": "2",
        "OfflineRelayEntityID": "",
        "openAICommentator": "1",
        "banHerosCamp1": ["105", "106", "108", "109", "110", "111", "112", "114", "116", "117", "121", "123", "124", "127", "130", "131", "132", "133", "134", "136", "140", "141", "142", "146", "148", "149", "150", "152", "153", "154", "156", "157", "162", "166", "167", "168", "169", "170", "171", "173", "174", "175", "177", "183", "180", "190", "192", "191", "182", "189", "193", "196", "195", "194", "198", "179", "501", "199", "176", "502", "197", "504", "125", "510", "137", "509", "508", "312", "507", "513", "515", "511", "529", "505", "506", "522", "518", "523", "525", "524", "531", "527", "533", "528", "537", "155", "538", "540", "542", "548", "521", "544", "545", "564", "514", "563", "519"],
        "banHerosCamp2": ["105", "106", "108", "109", "110", "111", "112", "114", "116", "117", "121", "123", "124", "127", "130", "131", "132", "133", "134", "136", "140", "141", "142", "146", "148", "149", "150", "152", "153", "154", "156", "157", "162", "166", "167", "168", "169", "170", "171", "173", "174", "175", "177", "183", "180", "190", "192", "191", "182", "189", "193", "196", "195", "194", "198", "179", "501", "199", "176", "502", "197", "504", "125", "510", "137", "509", "508", "312", "507", "513", "515", "511", "529", "505", "506", "522", "518", "523", "525", "524", "531", "527", "533", "528", "537", "155", "538", "540", "542", "548", "521", "544", "545", "564", "514", "563", "519"],
        "customDefineItems": ["0:6", "51:6", "56:6", "61:6", "66:6", "28:6", "71:6", "76:6", "81:6", "86:6", "3:3", "21:3", "54:3", "91:3", "59:3", "92:3", "64:3", "93:3", "69:3", "94:3", "31:3", "47:3", "74:3", "95:3", "79:3", "96:3", "84:3", "97:3", "89:3", "98:3", "4:4", "55:4", "60:4", "65:4", "70:4", "32:4", "75:4", "80:4", "85:4", "90:4", "106:3", "107:3", "108:3", "109:3", "110:3", "111:3", "112:3", "113:3", "114:3", "115:3", "5:5", "33:5", "6:5", "34:5", "7:3", "35:3", "8:3", "36:3", "9:1", "37:1", "14:3", "23:3", "42:3", "49:3", "17:3", "45:3", "10:2", "38:2"]
    };
    let keys = ["mapID", "mapType", "ullRoomid", "ullExternUid"]
    let headline = "快捷-80CD回血流 点击确定复制链接"
    let copytext = "🚀快捷房间配置：" + "\n" + "80CD回血流ㅤ中路出兵" + "\n" + "🈲该链接禁用英雄：" + "\n" + "廉颇 小乔 墨子 妲己...更多英雄请进链接查看" + "\n" + "🔗 点击下方链接加入房间" + "\n" + "最后处理链接" + " ©刻晴自定义"
    合成快捷房间参数(jsons, keys, headline, copytext)
};

(function () {
    let FuncStr = 生成链接.toString().replace(/function 生成链接/, 'window.生成指定链接=function');
    let result = FuncStr
    let replacetab = [
        // 无法判断是否是解析还是判断 只能这么写
        ['localStorage.getItem("custom_cof")', 'JSON.stringify(window.生成指定链接配置)'],
        ['edittab[2].value', '"指定链接自定义配置"']
    ]
    replacetab.forEach(([originalCode, replacement, mode]) => {
        replacement = replacement.replace(/\\/g, '\\\\');
        // mode为true在前面添加代码 为false在后面 为其他值不添加只替换
        if (mode == true) {
            replacement = replacement + ";" + originalCode
        } else if (mode == false) {
            replacement = originalCode + ";" + replacement
        }
        const safeOriginalCode = originalCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safeOriginalCode, 'g');
        result = result.replace(regex, replacement);
    });
    eval(result)
    return typeof 生成指定链接 == "function"
})()

function getRandomElements(arr, n) {
    arr = arr.slice(); //创建原始数组的副本，避免修改原数组

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; //交换元素
    }

    return arr.slice(0, n);
}


function 生成全随机链接(func) {
    let myheronum = []
    let newp
    let newdiv


    mdui.prompt({
        headline: "输入随机禁用数量",
        body: '<div class="radiodiv"></div>',
        description: "输入后 将创建一个新的配置 该配置为随机禁用的配置 你可选择生效的定位",
        confirmText: "确认",
        cancelText: "取消",
        onOpen: (dia) => {
            myedit = dia.querySelector("mdui-text-field")
            newdiv = document.createElement("div")
            radios = document.querySelector(".heromode").cloneNode(true).querySelectorAll('mdui-radio');
            let myheros = Object.values(mydatajson[1])
            radios.forEach(function (radio) {
                if (radio.innerText == "全部") return
                //分割符号 | 防止英雄id也包含指定的数字
                let name = ['|' + radio.value];
                // 构建关键词的正则表达式
                const keywordPattern = new RegExp(name.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
                // 使用 filter 方法过滤数组
                num = myheros.filter(item => keywordPattern.test(item)).length;
                myheronum.push(radio.textContent + num + "个")
                let checkbox = document.createElement('mdui-checkbox');
                checkbox.setAttribute('value', radio.value);
                checkbox.innerText = radio.innerText;
                checkbox.setAttribute('value', radio.value);
                checkbox.checked = true
                newdiv.appendChild(checkbox);
            })
            myedit.parentElement.insertBefore(newdiv, myedit);
            newp = document.createElement("p");
            let allheronum = Object.values(mydatajson[1]).length
            heronum = allheronum
            newp.textContent = "英雄数量 " + myheronum.join(" ")
            newdiv.parentElement.insertBefore(newp, newdiv);
        },
        onConfirm: (value) => {

            let name = []
            let children = newdiv.children
            Array.from(children).forEach(element => {
                if (element.checked == true) {
                    name.push(element.value)
                }
            });

            if (name.length == 0) {
                mdui_snackbar({
                    message: "请至少选择一个",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
                return false
            }

            let num = Number(value)
            if (isNaN(num)) {
                mdui_snackbar({
                    message: "请检查输入是否为数字",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
                return false
            }
            if (num < 1) {
                mdui_snackbar({
                    message: "必须输入大于0的数字",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
                return false
            }

            name = name.map(function (item) {
                //分割符号 | 防止英雄id也包含指定的数字
                return '|' + item;
            });


            let allheros = []
            for (let index = 0; index < 2; index++) {
                // 构建关键词的正则表达式
                const keywordPattern = new RegExp(name.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
                // 使用 filter 方法过滤数组
                let banheros = getRandomElements(Object.values(mydatajson[1]).filter(item => keywordPattern.test(item)), num).map(item => item.split('|')[0]);
                allheros.push(banheros)
            }


            window.生成指定链接配置 = {
                "指定链接自定义配置": {
                    "myjson": "[[[[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[5,5,5,5,5],[1,1,1,1,1],[1,1,1,1,1]],[[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[5,5,5,5,5],[1,1,1,1,1],[1,1,1,1,1]]],[[1,1],[1,1],[1,1],[1,1],[1,1],[\"null\",\"null\"]],[[1,1],[1,1]],[[1,1],[1,1],[1,1]],[[1,1],[1,1],1]]",
                    "yxtype": "all",
                    "bxtype": "all",
                    "sjtype": "all",
                    "adjson": [
                        "",
                        "",
                        "{\"1\":[\"1,2,3,4,5,6,7:1,2,3,4,5,6,7,8,9,10\"],\"2\":[\"1,2,3,4,5,6:1,2,3,4,5,6,7,8,9,10\"],\"3\":[\"1,2,3,4,5,6:1,2,3,4,5,6,7,8,9,10\"],\"5\":[\"1,2,3,4,5:1,2,3,4,5,6,7,8,9,10\"],\"6\":[\"1,2,3,4:1,2,3,4,5,6,7,8,9,10\"],\"7\":[\"1,2,3,4,5,6:1,2\"],\"8\":[\"1,2,3,4,5,6:1,2\"],\"9\":[\"1,2,3,4:1,2\"],\"10\":[\"1,2,3,4:1,2\"],\"11\":[\"1,2,3:1,2\"],\"12\":[\"0,1,2,3,4,5,6,null:1,2\"],\"13\":[\"1,2,3,4,5,6:1,2\"],\"14\":[\"1,2,3,4,5,6:1,2\"],\"15\":[\"1,2,3,4:1,2\"],\"16\":[\"1,2,3:1,2\"],\"17\":[\"1,2,3,4:1,2\"],\"18\":[\"1,2,3,4:1,2\"],\"19\":[\"1,2,3,4:1,2\"],\"20\":[\"1,2,3,4,5,6,7,8,9,10,11:1\"]}",
                        ""
                    ]
                }
            }

            生成指定链接(function (openurl, tiptext) {
                let OPENURL = openurl.split("SmobaLaunch_")[0] + "SmobaLaunch_";
                let ASCII = openurl.split("SmobaLaunch_")[1];
                let newjson = JSON.parse(atob(ASCII));
                newjson.banHerosCamp1 = allheros[0]
                newjson.banHerosCamp2 = allheros[1]
                var newjson_str = JSON.stringify(newjson);
                var openurl = OPENURL + btoa(newjson_str);
                func(openurl, tiptext)
            })

        },
        onCancel: () => console.log("canceled"),
    });
}

allbutton[17].onclick = function () {
    if (work_message != "null") {
        mdui_snackbar({
            message: work_message,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
        return;
    }



    生成全随机链接(function (openurl, tiptext) {

        getShortLink(window.location.origin + "/Smobas.html?data=" + openurl)
            .then(shortLink => {
                murl = processLink(shortLink);
                work_message = "null"

                mdui.confirm({
                    headline: "提示",
                    description: "当前玩法：随机参数无冷却",
                    confirmText: "确认",
                    cancelText: "取消",
                    onConfirm: () => {
                        var span = document.createElement('span');
                        span.innerHTML = '<span slot="description"><img src="https://api.gumengya.com/Api/QrCode?text=' + window.location.origin + "/data.html?" + murl + '" alt="QR Code" style="width: 100%; height: 100%;"></span>';

                        // 显示二维码
                        mdui.confirm({
                            headline: "随机参数无CD 点击确定复制链接",
                            description: span,
                            confirmText: "确认",
                            cancelText: "关闭",
                            onCancel: () => console.log("canceled"),
                            onConfirm: () => {
                                复制文本("🚀随机参数无CD:" + "\n" + "99CD其余参数未知，双方禁用英雄不一样，未知的，更刺激！" + "\n" + "🔗 点击下方链接加入房间" + "\n" + window.location.origin + "/data.html?" + murl + " ©刻晴自定义")
                                打开链接(openurl)
                            },
                            onCancel: () => console.log("canceled"),
                        });

                    },
                    onCancel: () => console.log("canceled"),
                });
            })
            .catch(error => {
                work_message = "null"
                mdui.alert({
                    headline: "提示",
                    description: "出现错误 无法请求 请检查网络",
                    confirmText: "我知道了",
                    onConfirm: () => console.log("confirmed"),
                });
                console.log(error)
            });
    })
}


allbutton[18].onclick = function () {
    let jsons = {
        "createType": 2,
        "mapID": 99988,
        "mapType": 1,
        "roomName": "room",
        "teamerNum": 20,
        "platType": 4,
        "campid": 1,
        "AddPos": 0,
        "AddType": 1,
    };
    let keys = ["ullRoomid", "ullExternUid"]
    let headline = "10V10众星峡谷 点击确定复制链接"
    let copytext = "🚀10V10众星峡谷" + "\n" + "🔗 点击下方链接加入房间" + "\n" + "最后处理链接" + " ©刻晴自定义"
    合成快捷房间参数(jsons, keys, headline, copytext)
}


document.getElementsByTagName("mdui-segmented-button-group")[0].addEventListener("change", function () {
    localStorage.setItem("gamemode", this.value)
})

document.querySelectorAll(".myedit")[0].onclick = function () {
    mdui_snackbar({
        message: "可向下滑动查看更多模式",
        action: "我知道了",
        onActionClick: () => console.log("click action button")
    });
}


function createTooltip(title, content) {
    // 创建 mdui-tooltip 元素
    const tooltip = document.createElement('mdui-tooltip');

    tooltip.trigger = "click"

    const tooltipContent = document.createElement('div');
    tooltipContent.setAttribute('slot', 'content');

    const tooltipTitle = document.createElement('div');
    tooltipTitle.style.fontSize = '1.4em';
    tooltipTitle.textContent = title;

    if (content) {
        const tooltipText = document.createElement('div');
        tooltipText.textContent = content;
        tooltipContent.appendChild(tooltipTitle);
        tooltipContent.appendChild(tooltipText);
    } else {
        // 如果没有附加内容，只添加标题
        tooltipContent.appendChild(tooltipTitle);
    }

    //内容添加到工具提示中
    tooltip.appendChild(tooltipContent);

    // 返回创建的工具提示元素
    return tooltip;
}



for (item in mydatajson[0]) {
    // 使用闭包解决
    (function (item_str) {
        // 创建新的 mdui-menu-item 元素  
        var menuItem = document.createElement('mdui-menu-item');
        // 设置文本内容  
        menuItem.textContent = item_str;
        menuItem.onclick = function () {
            localStorage.setItem("mapmode", item_str)
            document.querySelectorAll(".myedit")[0].value = item_str;
        }

        if (item_str.includes("征召")) {
            // 创建 mdui-tooltip 元素
            const tooltip = createTooltip("注意", "征召不可以添加人机哦 不建议开启");
            tooltip.appendChild(menuItem);
            document.querySelectorAll(".mymenu")[0].appendChild(tooltip);
            return
        }
        // 将新创建的元素添加到 DOM 中，例如添加到 body 中  
        if (item_str.includes("克隆")) {
            // 创建 mdui-tooltip 元素
            const tooltip = createTooltip("注意", "此地图仅提供开房间，不可无CD哦");
            tooltip.appendChild(menuItem);
            document.querySelectorAll(".mymenu")[0].appendChild(tooltip);
            return
        }
        if (item_str.includes("火焰山")) {
            // 创建 mdui-tooltip 元素
            const tooltip = createTooltip("注意", "此地图仅提供开房间，不可无CD哦");
            tooltip.appendChild(menuItem);
            document.querySelectorAll(".mymenu")[0].appendChild(tooltip);
            return
        }
        // 将新创建的元素添加到 DOM 中，例如添加到 body 中  
        if (item_str.includes("10v10")) {
            // 创建 mdui-tooltip 元素
            const tooltip = createTooltip("注意", "仅提供10v10开房间\n不可无CD哦");
            tooltip.appendChild(menuItem);
            document.querySelectorAll(".mymenu")[0].appendChild(tooltip);
            return
        }
        // 将新创建的元素添加到 DOM 中，例如添加到 body 中  
        document.querySelectorAll(".mymenu")[0].appendChild(menuItem);
    })(item);
}

var herodialog = document.querySelector(".example-dialog")

herotip = false
herodialog.querySelector("mdui-button").onclick = function () {
    if (herotip == false) {
        herotip = true
        mdui.confirm({
            headline: "提示",
            description: "确认关闭吗 更改了配置必须要新建或保存才能生效",
            confirmText: "确认",
            cancelText: "取消",
            onConfirm: () => {
                herodialog.open = false
            },
            onCancel: () => console.log("canceled"),
            onClose: () => herotip = false,
        });
    }
}

document.querySelectorAll(".myedit")[1].onclick = function () {
    加载英雄配置()
}

var customdialog = document.querySelector(".custom-dialog")

customtip = false
customdialog.querySelector("mdui-button").onclick = function () {
    if (customtip == false) {
        customtip = true
        mdui.confirm({
            headline: "提示",
            description: "确认关闭吗 更改了配置必须要新建或保存才能生效",
            confirmText: "确认",
            cancelText: "取消",
            onConfirm: () => {
                customdialog.open = false
            },
            onCancel: () => console.log("canceled"),
            onClose: () => customtip = false,
        });
    }
}

document.querySelectorAll(".myedit")[2].onclick = function () {
    加载自定义配置()
}

function loadherolist(batchSize = 10) {
    const items = Object.keys(mydatajson[1]);
    let currentIndex = 0;
    const targetList = document.getElementsByClassName('myherolist')[0];
    targetList.style.display = "flex"
    targetList.style.flexDirection = "row"
    targetList.style.flexWrap = "wrap"
    targetList.style.justifyContent = "space-around"


    function processNextBatch() {
        const batchItems = [];
        for (let i = currentIndex; i < Math.min(currentIndex + batchSize, items.length); i++) {
            const item_str = items[i];
            const imgurl = `https://image.smoba.qq.com/Banner/img/QQArk/heroicon/${mydatajson[1][item_str].split("|")[0]}.png`

            // 创建mdui-card元素
            var mduiCard = document.createElement('mdui-card');
            mduiCard.className = "mychip"
            mduiCard.style.width = "60px";
            mduiCard.style.height = "60px";
            mduiCard.clickable = true;
            mduiCard.variant = 'elevated';
            mduiCard.style.userSelect = "none"
            // 居中
            mduiCard.style.display = "flex"
            mduiCard.style.flexDirection = "column"
            mduiCard.style.justifyContent = "center"
            // 设置颜色
            mduiCard.style.backgroundColor = "rgb(var(--mdui-color-surface))"

            // 创建img元素
            var img = document.createElement('img');
            img.style.width = "30px"
            img.style.height = "30px"
            img.style.display = "block"
            img.style.margin = "0 auto"
            img.style.borderRadius = "12px"
            img.src = imgurl;
            img.loading = "lazy"
            img.onerror = function () {
                this.onerror = null
                this.src = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMHB4IiBoZWlnaHQ9IjMwcHgiPgogICAgICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNCREJEQkQiPjwvcmVjdD4KICAgIDwvc3ZnPg=='
            }

            // 创建mdui-icon-check元素
            var iconCheck = document.createElement('mdui-icon-check');
            iconCheck.style.position = 'absolute';
            iconCheck.style.fontSize = '19px';
            iconCheck.style.right = '0';
            iconCheck.style.bottom = '0';
            iconCheck.style.color = 'red';
            iconCheck.style.backgroundColor = 'rgb(var(--mdui-color-secondary-container))';
            iconCheck.style.visibility = "hidden"
            iconCheck.style.borderTopLeftRadius = '0.25rem';
            mduiCard.iconCheck = iconCheck

            // 创建一个可监听的属性 实现mdui-chip selected特性
            Object.defineProperty(mduiCard, 'selected', {
                configurable: true,
                enumerable: true,
                get: function () {
                    return this._selected;
                },
                set: function (newValue) {
                    if (newValue !== this._selected) {
                        if (typeof newValue == "boolean") {
                            this._selected = newValue;
                            if (newValue == true) {
                                this.style.backgroundColor = "rgb(var(--mdui-color-secondary-container))"
                                this.iconCheck.style.visibility = "unset"
                            }
                            else {
                                this.style.backgroundColor = "rgb(var(--mdui-color-surface))"
                                this.iconCheck.style.visibility = "hidden"
                            }
                        } else {
                            this._selected = false;
                        }
                    }
                }
            });

            mduiCard.addEventListener("click", function () {
                if (this.selected == true) {
                    this.selected = false
                } else {
                    this.selected = true
                }
            })


            var div = document.createElement('div');
            div.style.marginBottom = '5px';
            div.style.textAlign = 'center';
            div.textContent = item_str;
            div.style.fontSize = "12px"
            // 缩小line-height 防止挤压（临时解决方法 或许之后会有比元流之子更长名称的英雄?)
            div.style.lineHeight = "1.05"

            mduiCard.appendChild(img);
            mduiCard.appendChild(iconCheck);
            mduiCard.appendChild(div);
            batchItems.push(mduiCard);
        }

        if (batchItems.length > 0 && targetList) {
            targetList.append(...batchItems);
        }

        // 更新索引和检查是否需要继续加载
        currentIndex += batchSize;
        if (currentIndex < items.length) {
            requestAnimationFrame(processNextBatch);
        } else {
            window.loadherolist = true
            herodialog.updateComplete.then(() => {
                handleResize()
            });
            herodialog.addEventListener("open", function () {
                window.addEventListener('resize', handleResize);
            })
            herodialog.addEventListener("close", function () {
                window.removeEventListener('resize', handleResize);
            })
            herodialog.open = true
            var heros_json = JSON.parse(localStorage.getItem("custom_heros"))
            try {
                选择英雄名(heros_json[document.querySelectorAll(".myedit")[1].value])
            } catch (e) {
                console.log(e)
            }
        }
    }

    requestAnimationFrame(processNextBatch);
}


function getItemsPerRow(flexContainerSelector) {
    const flexItems = Array.from(document.querySelector(flexContainerSelector).children)
        .filter(item => item.isshow != false);
    const firstItem = flexItems[0];
    const firstRow = firstItem.offsetTop;
    const rowOffsets = [];
    let lastOffset = firstRow;

    // 查找所有行的起始点
    flexItems.forEach((item, index) => {
        if (item.offsetTop !== lastOffset) {
            rowOffsets.push(index);
            lastOffset = item.offsetTop;
        }
    });


    // 如果最后一个不是等于flexItems的长度  push数组长度
    if (rowOffsets[rowOffsets.length - 1] !== flexItems.length) {
        rowOffsets.push(flexItems.length);
    }

    // 计算每行的元素数量
    const itemsPerRow = rowOffsets.reduce((acc, cur, index) => {
        const start = index === 0 ? 0 : rowOffsets[index - 1];
        acc.push(cur - start);
        return acc;
    }, []);


    // 获取原始元素的计算样式
    const computedStyle = window.getComputedStyle(firstItem);

    return {
        firstRow: itemsPerRow[0],
        lastRow: itemsPerRow[itemsPerRow.length - 1],
        computedStyle: computedStyle,
        itemsPerRow: itemsPerRow
    };
}



// 定义一个处理窗口大小变化的函数
let timeoutId1
function handleResize() {
    clearTimeout(timeoutId1);
    timeoutId1 = setTimeout(function () {
        document.querySelectorAll('.emptyhero').forEach(el => el.remove());
        const itemsCountPerRow = getItemsPerRow(".myherolist");
        let firstRow = itemsCountPerRow.firstRow
        let lastRow = itemsCountPerRow.lastRow
        let computedStyle = itemsCountPerRow.computedStyle
        let width = computedStyle.width
        let height = computedStyle.height
        let padding = computedStyle.padding
        let margin = computedStyle.margin
        console.log(itemsCountPerRow)
        if (firstRow > lastRow) {
            const length = firstRow - lastRow
            for (let index = 0; index < length; index++) {
                const div = document.createElement('div');
                div.style.width = width;
                div.style.height = height;
                div.style.padding = padding;
                div.style.margin = margin;
                div.className = "emptyhero"
                document.querySelector(".myherolist").appendChild(div)
            }
        }
    }, 200);
}

document.getElementsByClassName("heromode")[0].addEventListener("change", function () {
    //分割符号 | 防止英雄id也包含指定的数字
    let defvalue = "|" + this.value
    var chips = document.querySelectorAll(".mychip")
    chips.forEacPh(chip => {
        let value = chip.textContent
        let mvalue = mydatajson[1][value]
        if (mvalue.includes(defvalue)) {
            chip.isshow = true
            chip.style.display = "flex"
        } else {
            chip.isshow = false
            chip.style.display = "none"
        }
    });
    handleResize()

    //清空数据
    search_heroedit.value = ""
})

var heroButton = document.getElementsByClassName("herobutton")

function 获取选择英雄名() {
    var childnodes = document.getElementsByClassName("myherolist")[0].childNodes
    var heroscof = ""
    childnodes.forEach(element => {
        if (element.selected == true) {
            if (heroscof != "") {
                heroscof = heroscof + " " + element.textContent
            } else {
                heroscof = element.textContent
            }
        }
    });
    return heroscof
}

function 选择英雄名(str) {
    if (typeof str == "undefined") {
        return
    }
    var childnodes = document.getElementsByClassName("myherolist")[0].childNodes
    childnodes.forEach(element => {
        element.selected = false
        if (str.includes(element.textContent)) {
            element.selected = true
        } else {
            element.selected = false
        }
    });
}

function 加载英雄配置() {
    var menudoc = document.querySelectorAll(".mymenu")[1]

    var ismenu
    if (herodialog.open == true) {
        ismenu = true
        menudoc = herodialog.getElementsByClassName("mymenu")[0]
    }

    var childnodes = menudoc.childNodes
    var heros_json = JSON.parse(localStorage.getItem("custom_heros"))


    for (let index = 0; index < childnodes.length; index++) {
        const element = childnodes[index];
        if (element.className != "search_edit") {
            element.remove()
            index--
        }
    }

    if (ismenu != true) {
        // 创建新的 mdui-menu-item 元素  
        var menuItem = document.createElement('mdui-menu-item');
        // 设置文本内容  
        menuItem.textContent = "管理配置";
        menuItem.onclick = function () {
            const loadherolist = window.loadherolist
            if (loadherolist == true) {
                try {
                    选择英雄名(heros_json[document.querySelectorAll(".myedit")[1].value])
                } catch (e) {
                    console.log(e)
                }
                herodialog.open = true
            } else {
                mdui_snackbar({
                    message: "加载中",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
                loadherolist(10)
            }
        }

        menudoc.appendChild(menuItem);
    }

    if (localStorage.getItem("custom_heros")) {
        if (Object.keys(heros_json).length == 0) {
            mdui_snackbar({
                message: tip1,
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
            return
        }

        if (ismenu != true) {
            for (item in heros_json) {
                // 使用闭包解决
                (function (item_str) {
                    // 创建新的 mdui-menu-item 元素  
                    var menuItem = document.createElement('mdui-menu-item');
                    // 设置文本内容  
                    menuItem.textContent = item_str;
                    menuItem.onclick = function () {
                        localStorage.setItem("banheros", item_str)
                        document.querySelectorAll(".myedit")[1].value = item_str;
                    }
                    // 将新创建的元素添加到 DOM 中，例如添加到 body 中  
                    menudoc.appendChild(menuItem);
                })(item);
            }
        } else {
            for (item in heros_json) {
                // 使用闭包解决
                (function (item_str) {
                    // 创建新的 mdui-menu-item 元素  
                    var menuItem = document.createElement('mdui-menu-item');
                    // 设置文本内容  
                    menuItem.textContent = item_str;
                    menuItem.onclick = function () {
                        localStorage.setItem("banheros", item_str)
                        document.querySelectorAll(".myedit")[1].value = item_str;
                        选择英雄名(heros_json[document.querySelectorAll(".myedit")[1].value])
                    }
                    // 将新创建的元素添加到 DOM 中，例如添加到 body 中  
                    menudoc.appendChild(menuItem);
                })(item);
            }
        }

    } else {
        mdui_snackbar({
            message: tip1,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
    }

}


function 复制文本(str) {
    // 替换换行符为 HTML 的换行标签
    const htmlStr = str.replace(/\n/g, '<br>');
    // 创建一个新的元素节点来包含 HTML 内容
    const div = document.createElement('div');
    div.innerHTML = htmlStr;
    document.body.appendChild(div);

    // 创建一个范围对象
    const range = document.createRange();
    // 将新创建的元素节点添加到范围中
    range.selectNode(div);
    // 获取当前选择
    const selection = window.getSelection();
    // 移除之前选中内容
    if (selection.rangeCount > 0) selection.removeAllRanges();
    // 将范围添加到选择中
    selection.addRange(range);
    // 执行复制命令
    document.execCommand('copy');
    // 移除范围，清空选择
    selection.removeAllRanges();
    div.remove();

    mdui_snackbar({
        message: "复制成功",
        action: "我知道了",
        onActionClick: () => console.log("click action button")
    });
}

function 修改键名(jsonObj, oldKey, newKey) {
    // 创建一个新的 JSON 对象
    const newJsonObj = {};

    // 遍历旧 JSON 对象的键值对
    for (const key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
            // 如果当前键是要修改的键，则使用新的键名，否则保持原样
            const targetKey = (key === oldKey) ? newKey : key;

            // 将键值对添加到新的 JSON 对象中
            newJsonObj[targetKey] = jsonObj[key];
        }
    }

    return newJsonObj;
}

heroButton[0].onclick = function () {
    加载英雄配置()
}

heroButton[1].onclick = function () {
    mdui.prompt({
        headline: "新建配置",
        description: "请输入配置名以新建配置",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: (value) => {
            var heros_json
            var 英雄名 = 获取选择英雄名()
            if (localStorage.getItem("custom_heros")) {
                heros_json = JSON.parse(localStorage.getItem("custom_heros"))
            } else {
                heros_json = {}
            }

            if (value == "") {
                var Rand = Math.random()
                var mineId = Math.round(Rand * 100000000)
                value = "未命名" + mineId.toString()
            }

            heros_json[value] = 英雄名;

            localStorage.setItem("custom_heros", JSON.stringify(heros_json))

            localStorage.setItem("banheros", value)
            document.querySelectorAll(".myedit")[1].value = value;

            加载英雄配置()
            mdui_snackbar({
                message: "新建配置成功",
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
        },
        onCancel: () => console.log("canceled"),
    });
}

heroButton[2].onclick = function () {
    var 英雄名 = 获取选择英雄名()
    复制文本(英雄名)
}

heroButton[3].onclick = function () {
    mdui.prompt({
        headline: "导入配置",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: (value) => {
            try {
                选择英雄名(value)
                mdui_snackbar({
                    message: tip3,
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
            } catch {
                mdui_snackbar({
                    message: "输入配置有误",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
            }
        },
        onCancel: () => console.log("canceled"),
    });
}

heroButton[4].onclick = function () {
    if (localStorage.getItem("custom_heros")) {
        var editvalue = document.querySelectorAll(".myedit")[1].value
        if (JSON.parse(localStorage.getItem("custom_heros"))[editvalue]) {
            mdui.confirm({
                headline: "提示",
                description: "是否删除该配置",
                confirmText: "确认",
                cancelText: "取消",
                onConfirm: () => {
                    var heros_json = JSON.parse(localStorage.getItem("custom_heros"))
                    delete heros_json[editvalue]
                    localStorage.setItem("custom_heros", JSON.stringify(heros_json))
                    localStorage.setItem("banheros", "")
                    document.querySelectorAll(".myedit")[1].value = ""

                    var childnodes = document.getElementsByClassName("myherolist")[0].childNodes
                    childnodes.forEach(element => {
                        element.selected = false
                    });
                    herodialog.bodyRef.value.scroll({ top: 0, behavior: 'smooth' });

                    mdui_snackbar({
                        message: "删除配置成功",
                        action: "我知道了",
                        onActionClick: () => console.log("click action button")
                    });
                },
                onCancel: () => console.log("canceled"),
            });
        } else {
            mdui_snackbar({
                message: tip5,
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
        }
    } else {
        mdui_snackbar({
            message: tip2,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
    }
}

heroButton[5].onclick = function () {
    if (localStorage.getItem("custom_heros")) {
        var editvalue = document.querySelectorAll(".myedit")[1].value
        if (JSON.parse(localStorage.getItem("custom_heros"))[editvalue]) {
            mdui.prompt({
                headline: "提示",
                description: tip4,
                confirmText: "确认",
                cancelText: "取消",
                onConfirm: (value) => {
                    var heros_json = JSON.parse(localStorage.getItem("custom_heros"))
                    var heros_json = 修改键名(heros_json, editvalue, value);
                    localStorage.setItem("custom_heros", JSON.stringify(heros_json))
                    localStorage.setItem("banheros", value)
                    document.querySelectorAll(".myedit")[1].value = value
                    加载英雄配置()
                    mdui_snackbar({
                        message: "重命名配置成功",
                        action: "我知道了",
                        onActionClick: () => console.log("click action button")
                    });
                },
                onCancel: () => console.log("canceled"),
            });
        } else {
            mdui_snackbar({
                message: tip5,
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
        }
    } else {
        mdui_snackbar({
            message: tip2,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
    }
}

heroButton[6].onclick = function () {
    var childnodes = document.getElementsByClassName("myherolist")[0].childNodes
    childnodes.forEach(element => {
        if (element.isshow == false) {
            return
        }
        element.selected = true
    });
}

heroButton[7].onclick = function () {
    var childnodes = document.getElementsByClassName("myherolist")[0].childNodes
    childnodes.forEach(element => {
        if (element.isshow == false) {
            return
        }
        if (element.selected == true) {
            element.selected = false
        } else {
            element.selected = true
        }
    });
}

heroButton[8].onclick = function () {
    if (localStorage.getItem("custom_heros")) {
        var editvalue = document.querySelectorAll(".myedit")[1].value
        if (JSON.parse(localStorage.getItem("custom_heros"))[editvalue]) {
            mdui.confirm({
                headline: "提示",
                description: "是否保存该配置",
                confirmText: "确认",
                cancelText: "取消",
                onConfirm: () => {
                    var 英雄名 = 获取选择英雄名()
                    var heros_json = JSON.parse(localStorage.getItem("custom_heros"))
                    heros_json[editvalue] = 英雄名;
                    localStorage.setItem("custom_heros", JSON.stringify(heros_json))
                    mdui_snackbar({
                        message: "保存配置成功",
                        action: "我知道了",
                        onActionClick: () => console.log("click action button")
                    });
                },
                onCancel: () => console.log("canceled"),
            });
        } else {
            mdui_snackbar({
                message: tip5,
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
        }
    } else {
        mdui_snackbar({
            message: tip2,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
    }
}
heroButton[9].onclick = function () {
    function getRandomElements(arr, n) {
        arr = arr.slice(); // 创建原始数组的副本，避免修改原数组

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // 交换元素
        }

        return arr.slice(0, n);
    }

    mdui.prompt({
        headline: "输入随机禁用数量",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: (value) => {
            let num = Number(value);
            if (isNaN(num)) {
                mdui_snackbar({
                    message: "请检查输入是否为数字",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
                return false;
            }
            if (num < 1) {
                mdui_snackbar({
                    message: "必须输入大于0的数字",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
                return false;
            }
            if (num > 105) {
                mdui_snackbar({
                    message: "输入的数字不能大于105",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
                return false;
            }
            let result = getRandomElements(Object.keys(mydatajson[1]), num).join("|");
            let children = Array.from(document.getElementsByClassName("myherolist")[0].children);
            children.forEach(element => {
                let text = element.textContent;
                if (result.includes(text)) {
                    element.selected = true;
                } else {
                    element.selected = false;
                }
            });
            console.log(result);
        },
        onCancel: () => console.log("canceled"),
    });
}


function createMenuItems(settingsDoc, values, isdata) {

    var index = 1
    values.forEach(element => {
        // 使用闭包解决
        (function (item_str, index) {
            // 创建新的 mdui-menu-item 元素  
            var menuItem = document.createElement('mdui-menu-item');
            if (isdata) {
                menuItem.value = item_str;
            } else {
                menuItem.value = index
            }
            menuItem.textContent = item_str
            menuItem.onclick = function () {
            }
            // 将新创建的元素添加到 DOM 中，例如添加到 body 中  
            settingsDoc.appendChild(menuItem)
        })(element, index);
        index = index + 1
    });


    settingsDoc.updateComplete.then(() => {
        if (isdata) {
            settingsDoc.value = isdata;
        } else {
            settingsDoc.value = 1;
        }
        //存储默认值
        settingsDoc.defvalue = settingsDoc.value
    });
    return settingsDoc
}

function createList(str, doc) {
    // 创建 mdui-list 元素
    var list = document.createElement('mdui-list');
    // 创建 mdui-list-subheader 元素
    var listSubheader = document.createElement('mdui-list-subheader');
    listSubheader.textContent = str;
    // 将 mdui-list-subheader 添加到 mdui-list 中
    list.appendChild(listSubheader);
    // 返回创建的 mdui-list 元素
    doc.appendChild(list)
    return list;
}

function createSelectMenu(str, doc, ismultiple) {
    // 创建 mdui-select 元素
    var select = document.createElement('mdui-select');
    select.setAttribute('label', str);
    select.setAttribute('variant', "filled");
    select.style.padding = "10px"

    if (ismultiple) {
        select.setAttribute('multiple', '');
    }


    doc.appendChild(select)

    // 返回创建的 mdui-select 元素
    return select;
}

function CreateHeroList(str, mydoc) {
    var campdoc = createList(str, mydoc)
    createMenuItems(createSelectMenu("初级等级", campdoc), ["1级", "4级", "5级", "8级", "10级", "12级", "15级"]);
    createMenuItems(createSelectMenu("法术攻击加成", campdoc), ["无加成", "加10%", "加25%", "加50%", "加75%", "加100%"]);
    createMenuItems(createSelectMenu("物理攻击加成", campdoc), ["无加成", "加10%", "加25%", "加50%", "加75%", "加100%"]);
    createMenuItems(createSelectMenu("冷却缩减", campdoc), ["无加成", "减25%", "减40%", "减80%", "减99%"]);
    createMenuItems(createSelectMenu("初始金币", campdoc), ["无加成", "1000", "2000", "5000", "12000"]);
    createMenuItems(createSelectMenu("移速", campdoc), ["无加成", "加10%", "加20%", "加30%"]);
}

function CreatebxList(str, str2, mydoc) {
    var campdoc = createList(str, mydoc)
    var campdoc1 = createList(str2, mydoc)
    createMenuItems(createSelectMenu("攻击力", campdoc), ["无加成", "加10%", "加25%", "加50%", "加75%", "加100%"]);
    createMenuItems(createSelectMenu("血量", campdoc), ["无加成", "加10%", "加25%", "加50%", "加75%", "加100%"]);
    createMenuItems(createSelectMenu("移动速度", campdoc), ["无加成", "加25%", "加50%", "加100%"]);
    createMenuItems(createSelectMenu("刷新速度", campdoc), ["无加成", "加5%", "加10%", "加15%"]);
    createMenuItems(createSelectMenu("出兵类型", campdoc), ["普通兵线", "超级兵", "主宰先锋"]);
    createMenuItems(createSelectMenu("出兵路线", campdoc, true), ["对抗路", "中路", "发育路"], ["对抗路", "中路", "发育路"]);

    createMenuItems(createSelectMenu("攻击力", campdoc1), ["无加成", "加10%", "加25%", "加50%", "加75%", "加100%"]);
    createMenuItems(createSelectMenu("血量", campdoc1), ["无加成", "加10%", "加25%", "加50%", "加75%", "加100%"]);

}

function CreatesjList(str, str2, mydoc) {

    var campdoc = createList(str, mydoc)
    var campdoc1 = createList(str2, mydoc)

    createMenuItems(createSelectMenu("攻击力", campdoc), ["无加成", "加25%", "加50%", "加100%"]);
    createMenuItems(createSelectMenu("攻击范围", campdoc), ["无加成", "加25%", "加50%"]);
    createMenuItems(createSelectMenu("血量", campdoc), ["无加成", "加25%", "加50%", "加100%"]);

    createMenuItems(createSelectMenu("攻击力", campdoc1), ["无加成", "加25%", "加50%", "加100%"]);
    createMenuItems(createSelectMenu("血量", campdoc1), ["无加成", "加25%", "加50%", "加100%"]);

}

var allputong = document.getElementsByClassName("putong")
var zhenyingDocBlue = document.getElementsByClassName("zhenying_blue")
var zhenyingDocRed = document.getElementsByClassName("zhenying_red")

function loadmenu() {
    var herolist = Array.from({ length: 5 }, (_, i) => (i + 1).toString() + "号")

    var xvanshouBlue = document.getElementsByClassName("xvanshou_blue")[0]
    var xvanshouRed = document.getElementsByClassName("xvanshou_red")[0]
    // 对于herolist中的每一个元素创建任务
    const herolistTasks = herolist.map((element, index) => {
        return () => {
            const item_str = element;
            CreateHeroList("蓝方" + item_str + "英雄属性", xvanshouBlue);
            CreateHeroList("红方" + item_str + "英雄属性", xvanshouRed);
        };
    });

    var mydoc = document.getElementsByClassName("CustomSettings")[2]
    var campdoc = createList("胜利条件", mydoc)


    function processNextTask() {
        if (tasks.length > 0) {
            const task = tasks.shift();
            task();
            requestAnimationFrame(processNextTask);
        } else {
            document.getElementsByClassName("xvanshou_blue")[0].getElementsByTagName("mdui-list")[0].style.display = ""
            document.getElementsByClassName("xvanshou_red")[0].getElementsByTagName("mdui-list")[0].style.display = ""
            window.loadmenu = true
            customdialog.open = true
            document.getElementsByClassName("blueheronum")[0].value = "1"
            document.getElementsByClassName("redheronum")[0].value = "1"
            var custom_json = JSON.parse(localStorage.getItem("custom_cof"))

            try {
                选择自定义配置(custom_json[document.querySelectorAll(".myedit")[2].value])
            } catch (e) {
                console.log(e)
            }
        }
    }

    // 将所有创建和添加元素的任务放在一个数组里
    const tasks = [
        () => CreateHeroList("英雄属性", allputong[0]),
        () => CreateHeroList("蓝方英雄属性", zhenyingDocBlue[0]),
        () => CreateHeroList("红方英雄属性", zhenyingDocRed[0]),
        () => CreatebxList("兵线属性", "野怪属性", allputong[1]),
        () => CreatebxList("蓝方兵线属性", "蓝方野怪属性", zhenyingDocBlue[1]),
        () => CreatebxList("红方兵线属性", "红方野怪属性", zhenyingDocRed[1]),
        () => CreatesjList("防御塔属性", "水晶属性", allputong[2]),
        () => createMenuItems(createSelectMenu("胜利条件", campdoc), ["摧毁水晶", "摧毁任意一个一塔", "摧毁任意一个二塔", "摧毁任意一个三塔", "3个总击败", "20个总击败", "30个总击败", "40个总击败", "1个助攻", "5个助攻", "10个助攻",]).id = "mytiao",
        () => CreatesjList("蓝方防御塔属性", "蓝方水晶属性", zhenyingDocBlue[2]),
        () => CreatesjList("红方防御塔属性", "红方水晶属性", zhenyingDocRed[2]),
    ];

    tasks.push(...herolistTasks);

    requestAnimationFrame(processNextTask);
}


function zhenying_panduan(pos, defvalue, xvanshou) {
    document.getElementsByClassName("zhenying_xz")[pos].style.display = ""
    if (defvalue == "blue") {
        if (xvanshou) {
            document.getElementsByClassName("xvanshou")[pos].style.display = "none"
        }
        zhenyingDocBlue[pos].style.display = ""
        zhenyingDocRed[pos].style.display = "none"
    } else if (defvalue == "red") {
        if (xvanshou) {
            document.getElementsByClassName("xvanshou")[pos].style.display = "none"
        }
        zhenyingDocBlue[pos].style.display = "none"
        zhenyingDocRed[pos].style.display = ""
    }
}

document.getElementsByClassName("zhenying_xz")[0].addEventListener("change", function () {
    zhenying_panduan(0, this.value, true)
})
document.getElementsByClassName("zhenying_xz")[1].addEventListener("change", function () {
    zhenying_panduan(1, this.value)
})
document.getElementsByClassName("zhenying_xz")[2].addEventListener("change", function () {
    zhenying_panduan(2, this.value)
})

function custom_panduan(pos, defvalue, xvanshou) {
    if (defvalue == "zhenying") {
        document.getElementsByClassName("zhenying_xz")[pos].style.display = ""
        allputong[pos].style.display = "none"
        var mdefvalue = document.getElementsByClassName("zhenying_xz")[pos].value
        if (mdefvalue == "blue") {
            document.getElementsByClassName("zhenying")[pos].style.display = ""
            if (xvanshou) {
                document.getElementsByClassName("xvanshou")[pos].style.display = "none"
            }
            zhenyingDocBlue[pos].style.display = ""
            zhenyingDocRed[pos].style.display = "none"
        } else {
            document.getElementsByClassName("zhenying")[pos].style.display = ""
            if (xvanshou) {
                document.getElementsByClassName("xvanshou")[pos].style.display = "none"
            }
            zhenyingDocBlue[pos].style.display = "none"
            zhenyingDocRed[pos].style.display = ""
        }
    } else if (defvalue == "xvanshou") {
        allputong[pos].style.display = "none"
        document.getElementsByClassName("zhenying")[pos].style.display = "none"
        document.getElementsByClassName("zhenying_xz")[pos].style.display = "none"
        document.getElementsByClassName("xvanshou")[pos].style.display = ""
    } else if (defvalue == "all") {
        allputong[pos].style.display = ""
        document.getElementsByClassName("zhenying")[pos].style.display = "none"
        document.getElementsByClassName("zhenying_xz")[pos].style.display = "none"
        if (xvanshou) {
            document.getElementsByClassName("xvanshou")[pos].style.display = "none"
        }
    }
}

document.getElementsByClassName("setmode")[0].addEventListener("change", function () {
    custom_panduan(0, this.value, true)
})

document.getElementsByClassName("setmode")[1].addEventListener("change", function () {
    custom_panduan(1, this.value)
})

document.getElementsByClassName("setmode")[2].addEventListener("change", function () {
    custom_panduan(2, this.value)
})

document.getElementsByClassName("blueheronum")[0].addEventListener("change", function () {
    var defvalue = this.value
    var doc = document.getElementsByClassName("xvanshou_blue")[0].getElementsByTagName("mdui-list")
    for (let index = 0; index < doc.length; index++) {
        const element = doc[index];
        if (index + 1 == [parseInt(defvalue)]) {
            element.style.display = ""
        } else {
            element.style.display = "none"
        }

    }
})

document.getElementsByClassName("redheronum")[0].addEventListener("change", function () {
    var defvalue = this.value
    var doc = document.getElementsByClassName("xvanshou_red")[0].getElementsByTagName("mdui-list")
    for (let index = 0; index < doc.length; index++) {
        const element = doc[index];
        if (index + 1 == [parseInt(defvalue)]) {
            element.style.display = ""
        } else {
            element.style.display = "none"
        }

    }
})

// Fisher-Yates 洗牌算法
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // 交换元素
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shuffleArray2(Arr1, Arr2, randomtab) {
    var combinedArr = Arr1.concat(Arr2);
    // 打乱合并后的数组
    shuffleSelectedPositions(combinedArr, randomtab);
    // 将打乱后的数组拆分成两个数组
    var shuffledArr1 = combinedArr.slice(0, Arr1.length);
    var shuffledArr2 = combinedArr.slice(Arr1.length);
    // 打印结果（示例）
    console.log("打乱前:", Arr1, Arr2);
    console.log("打乱后的:", shuffledArr1, shuffledArr2);
    return [shuffledArr1, shuffledArr2]
}


function shuffleSelectedPositions(arr, positionsToShuffle) {
    const shuffledArr = arr;
    const length = positionsToShuffle.length;

    for (let i = 0; i < length; i++) {
        const currentPos = positionsToShuffle[i] - 1;
        const randomPos = Math.floor(Math.random() * length);

        // 使用数组解构交换元素
        [shuffledArr[currentPos], shuffledArr[positionsToShuffle[randomPos] - 1]] = [shuffledArr[positionsToShuffle[randomPos] - 1], shuffledArr[currentPos]];
    }

    return shuffledArr;
}



function getRandomElementFromArray(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}


function shuffleArray3(Arr1, Arr2, randomtab, postab) {
    var combinedArr = Arr1.concat(Arr2);
    // 打乱合并后的数组
    for (let index = 0; index < postab.length; index++) {
        const pos = postab[index] - 1
        let random = getRandomElementFromArray(randomtab)
        combinedArr[pos] = random
    }
    // 将打乱后的数组拆分成两个数组
    var shuffledArr1 = combinedArr.slice(0, Arr1.length);
    var shuffledArr2 = combinedArr.slice(Arr1.length);
    console.log("随机生成前:", Arr1, Arr2);
    console.log("随机生成后的:", shuffledArr1, shuffledArr2);
    return [shuffledArr1, shuffledArr2]
}

function shuffleArray4(Arr, randomtab, postab) {
    if (Array.isArray(Arr) == false) {
        let random = getRandomElementFromArray(randomtab)
        console.log("随机生成前:", Arr);
        console.log("随机生成后的:", randomtab);
        return random
    }
    const combinedArr = [...Arr]
    // 打乱合并后的数组
    for (let index = 0; index < postab.length; index++) {
        const pos = postab[index] - 1
        let random = getRandomElementFromArray(randomtab)
        combinedArr[pos] = random
    }
    console.log("随机生成前:", Arr);
    console.log("随机生成后的:", combinedArr);
    return combinedArr
}

function decrementNumberAfterColon(inputString) {
    return inputString.replace(/:(\d+)$/, (match, capturedNumber) => `:${parseInt(capturedNumber, 10) - 1}`);
}


function makejson(HeroList, bxList, ygList, fytList, sjList, gjjson) {

    //懒得优化的代码 或许会在有生之年优化吧

    var HeroList_blue = HeroList[0]
    var HeroList_red = HeroList[1]

    var expList_blue = HeroList_blue[0]
    var expList_red = HeroList_red[0]


    var fashuList_blue = HeroList_blue[1]
    var fashuList_red = HeroList_red[1]

    var wuliList_blue = HeroList_blue[2]
    var wuliList_red = HeroList_red[2]

    var cdList_blue = HeroList_blue[3]
    var cdList_red = HeroList_red[3]

    var jinbiList_blue = HeroList_blue[4]
    var jinbiList_red = HeroList_red[4]

    var ysList_blue = HeroList_blue[5]
    var ysList_red = HeroList_red[5]

    var sjsc = gjjson[2]
    var sjdl = gjjson[3]

    function 判断随机生成数据(pos, randomtab, postab) {
        if (pos == 1) {
            const result = shuffleArray3(expList_blue, expList_red, randomtab, postab);
            expList_blue = result[0]
            expList_red = result[1]
        } else if (pos == 2) {
            const result = shuffleArray3(fashuList_blue, fashuList_red, randomtab, postab);
            fashuList_blue = result[0]
            fashuList_red = result[1]
        } else if (pos == 3) {
            const result = shuffleArray3(wuliList_blue, wuliList_red, randomtab, postab);
            wuliList_blue = result[0]
            wuliList_red = result[1]
        } else if (pos == 4) {
            const result = shuffleArray3(cdList_blue, cdList_red, randomtab, postab);
            cdList_blue = result[0]
            cdList_red = result[1]
        } else if (pos == 5) {
            const result = shuffleArray3(jinbiList_blue, jinbiList_red, randomtab, postab);
            jinbiList_blue = result[0]
            jinbiList_red = result[1]
        } else if (pos == 6) {
            const result = shuffleArray3(ysList_blue, ysList_red, randomtab, postab);
            ysList_blue = result[0]
            ysList_red = result[1]
        } else if (pos == 7) {
            bxList[0] = shuffleArray4(bxList[0], randomtab, postab);
        } else if (pos == 8) {
            bxList[1] = shuffleArray4(bxList[1], randomtab, postab);
        } else if (pos == 9) {
            bxList[2] = shuffleArray4(bxList[2], randomtab, postab);
        } else if (pos == 10) {
            bxList[3] = shuffleArray4(bxList[3], randomtab, postab);
        } else if (pos == 11) {
            bxList[4] = shuffleArray4(bxList[4], randomtab, postab);
        } else if (pos == 12) {
            bxList[5] = shuffleArray4(bxList[5], randomtab, postab);
        } else if (pos == 13) {
            ygList[0] = shuffleArray4(ygList[0], randomtab, postab);
        } else if (pos == 14) {
            ygList[1] = shuffleArray4(ygList[1], randomtab, postab);
        } else if (pos == 15) {
            fytList[0] = shuffleArray4(fytList[0], randomtab, postab);
        } else if (pos == 16) {
            fytList[1] = shuffleArray4(fytList[1], randomtab, postab);
        } else if (pos == 17) {
            fytList[2] = shuffleArray4(fytList[2], randomtab, postab);
        } else if (pos == 18) {
            sjList[0] = shuffleArray4(sjList[0], randomtab, postab);
        } else if (pos == 19) {
            sjList[1] = shuffleArray4(sjList[1], randomtab, postab);
        } else if (pos == 20) {
            sjList[2] = shuffleArray4(sjList[2], randomtab, postab);
        }
    }

    function 判断随机打乱数据(pos, randomtab) {
        if (pos == 1) {
            const result = shuffleArray2(expList_blue, expList_red, randomtab);
            expList_blue = result[0]
            expList_red = result[1]
        } else if (pos == 2) {
            const result = shuffleArray2(fashuList_blue, fashuList_red, randomtab);
            fashuList_blue = result[0]
            fashuList_red = result[1]
        } else if (pos == 3) {
            const result = shuffleArray2(wuliList_blue, wuliList_red, randomtab);
            wuliList_blue = result[0]
            wuliList_red = result[1]
        } else if (pos == 4) {
            const result = shuffleArray2(cdList_blue, cdList_red, randomtab);
            cdList_blue = result[0]
            cdList_red = result[1]
        } else if (pos == 5) {
            const result = shuffleArray2(jinbiList_blue, jinbiList_red, randomtab);
            jinbiList_blue = result[0]
            jinbiList_red = result[1]
        } else if (pos == 6) {
            const result = shuffleArray2(ysList_blue, ysList_red, randomtab);
            ysList_blue = result[0]
            ysList_red = result[1]
        } else if (pos == 7) {
            bxList[0] = shuffleArray(bxList[0]);
        } else if (pos == 8) {
            bxList[1] = shuffleArray(bxList[1]);
        } else if (pos == 9) {
            bxList[2] = shuffleArray(bxList[2]);
        } else if (pos == 10) {
            bxList[3] = shuffleArray(bxList[3]);
        } else if (pos == 11) {
            bxList[4] = shuffleArray(bxList[4]);
        } else if (pos == 12) {
            bxList[5] = shuffleArray(bxList[5]);
        } else if (pos == 13) {
            ygList[0] = shuffleArray(ygList[0]);
        } else if (pos == 14) {
            ygList[1] = shuffleArray(ygList[1]);
        } else if (pos == 15) {
            fytList[0] = shuffleArray(fytList[0]);
        } else if (pos == 16) {
            fytList[1] = shuffleArray(fytList[1]);
        } else if (pos == 17) {
            fytList[2] = shuffleArray(fytList[2]);
        } else if (pos == 18) {
            sjList[0] = shuffleArray(sjList[0]);
        } else if (pos == 19) {
            sjList[1] = shuffleArray(sjList[1]);
        }
    }

    if (sjsc != "" && isJSON(sjsc)) {
        var scgz = JSON.parse(sjsc)

        for (item in scgz) {
            // 使用闭包解决
            (function (item_str) {
                scgz[item_str].forEach(element => {
                    var [randomtab, postab] = element.split(":")
                    randomtab = randomtab.match(/\d+/g).map(Number);
                    postab = postab.match(/\d+/g).map(Number);
                    判断随机生成数据(item_str, randomtab, postab)
                });
            })(item);
        }

    }

    if (sjdl != "" && isJSON(sjdl)) {
        var scgz1 = JSON.parse(sjdl)

        for (item in scgz1) {
            // 使用闭包解决
            (function (item_str) {
                scgz1[item_str].forEach(element => {
                    let randomtab = element.match(/\d+/g).map(Number);
                    判断随机打乱数据(item_str, randomtab)
                });
            })(item);
        }

    }


    var jsondo = [
        "0:" + expList_blue[0],
        "51:" + expList_blue[1],
        "56:" + expList_blue[2],
        "61:" + expList_blue[3],
        "66:" + expList_blue[4],
        "28:" + expList_red[0],
        "71:" + expList_red[1],
        "76:" + expList_red[2],
        "81:" + expList_red[3],
        "86:" + expList_red[4],
        "1:" + fashuList_blue[0],
        "52:" + fashuList_blue[1],
        "57:" + fashuList_blue[2],
        "62:" + fashuList_blue[3],
        "67:" + fashuList_blue[4],
        "29:" + fashuList_red[0],
        "72:" + fashuList_red[1],
        "77:" + fashuList_red[2],
        "82:" + fashuList_red[3],
        "87:" + fashuList_red[4],
        "2:" + wuliList_blue[0],
        "53:" + wuliList_blue[1],
        "58:" + wuliList_blue[2],
        "63:" + wuliList_blue[3],
        "68:" + wuliList_blue[4],
        "30:" + wuliList_red[0],
        "73:" + wuliList_red[1],
        "78:" + wuliList_red[2],
        "83:" + wuliList_red[3],
        "88:" + wuliList_red[4],
        "3:" + cdList_blue[0],
        "21:" + cdList_blue[0],
        "54:" + cdList_blue[1],
        "91:" + cdList_blue[1],
        "59:" + cdList_blue[2],
        "92:" + cdList_blue[2],
        "64:" + cdList_blue[3],
        "93:" + cdList_blue[3],
        "69:" + cdList_blue[4],
        "94:" + cdList_blue[4],
        "31:" + cdList_red[0],
        "47:" + cdList_red[0],
        "74:" + cdList_red[1],
        "95:" + cdList_red[1],
        "79:" + cdList_red[2],
        "96:" + cdList_red[2],
        "84:" + cdList_red[3],
        "97:" + cdList_red[3],
        "89:" + cdList_red[4],
        "98:" + cdList_red[4],
        "4:" + jinbiList_blue[0],
        "55:" + jinbiList_blue[1],
        "60:" + jinbiList_blue[2],
        "65:" + jinbiList_blue[3],
        "70:" + jinbiList_blue[4],
        "32:" + jinbiList_red[0],
        "75:" + jinbiList_red[1],
        "80:" + jinbiList_red[2],
        "85:" + jinbiList_red[3],
        "90:" + jinbiList_red[4],
        "106:" + ysList_blue[0],
        "107:" + ysList_blue[1],
        "108:" + ysList_blue[2],
        "109:" + ysList_blue[3],
        "110:" + ysList_blue[4],
        "111:" + ysList_red[0],
        "112:" + ysList_red[1],
        "113:" + ysList_red[2],
        "114:" + ysList_red[3],
        "115:" + ysList_red[4],
        "5:" + bxList[0][0],
        "33:" + bxList[0][1],
        "6:" + bxList[1][0],
        "34:" + bxList[1][1],
        "7:" + bxList[2][0],
        "35:" + bxList[2][1],
        "8:" + bxList[3][0],
        "36:" + bxList[3][1],
        "9:" + bxList[4][0],
        "37:" + bxList[4][1],
        /*
        "10:" + bxList[5][0],
        "38:" + bxList[5][1],
        */
        "11:" + ygList[0][0],
        "39:" + ygList[0][1],
        "12:" + ygList[1][0],
        "40:" + ygList[1][1],
        "13:" + fytList[0][0],
        "22:" + fytList[0][0],
        "41:" + fytList[0][1],
        "48:" + fytList[0][1],
        "15:" + fytList[1][0],
        "24:" + fytList[1][0],
        "43:" + fytList[1][1],
        "50:" + fytList[1][1],
        "14:" + fytList[2][0],
        "23:" + fytList[2][0],
        "42:" + fytList[2][1],
        "49:" + fytList[2][1],
        "16:" + sjList[0][0],
        "44:" + sjList[0][1],
        "17:" + sjList[1][0],
        "45:" + sjList[1][1],
    ]

    for (let index = 0; index < jsondo.length; index++) {
        const element = jsondo[index];
        const value = element.split(":")[1]
        if (value == "" || value == "0") {
            throw "自定义配置信息有误 点击自定义配置的管理配置手动保存配置来更新该配置即可解决该问题"
        }
        if (value == "1") {
            jsondo.splice(index, 1);
            index--;
        } else {
            jsondo[index] = decrementNumberAfterColon(element)
        }

    }

    var bxdata = bxList[5]
    var blue_bxdata = bxdata[0]
    var red_bxdata = bxdata[1]

    var add_bxdata = []

    if (blue_bxdata != "null") {
        add_bxdata.push("10:" + blue_bxdata)
    }

    if (red_bxdata != "null") {
        add_bxdata.push("38:" + red_bxdata)
    }

    jsondo = [...jsondo, ...add_bxdata]

    var gamemode = sjList[2]

    var gamelist = {
        1: [],
        2: ["19:1"],
        3: ["19:1", "103:1"],
        4: ["19:1", "103:2"],
        5: ["19:2"],
        6: ["19:2", "20:1"],
        7: ["19:2", "20:2"],
        8: ["19:2", "20:3"],
        9: ["19:2", "105:1"],
        10: ["19:2", "105:1", "104:1"],
        11: ["19:2", "105:1", "104:2"],

    }

    jsondo = [...jsondo, ...gamelist[gamemode]]


    return jsondo;
}



function 加载自定义配置() {
    var menudoc = document.querySelectorAll(".mymenu")[2]

    var ismenu
    if (customdialog.open == true) {
        ismenu = true
        menudoc = customdialog.getElementsByClassName("mymenu")[0]
    }

    var childnodes = menudoc.childNodes
    var custom_json = JSON.parse(localStorage.getItem("custom_cof"))


    for (let index = 0; index < childnodes.length; index++) {
        const element = childnodes[index];
        if (element.className != "search_edit") {
            element.remove()
            index--
        }
    }

    if (ismenu != true) {
        // 创建新的 mdui-menu-item 元素  
        var menuItem = document.createElement('mdui-menu-item');
        // 设置文本内容  
        menuItem.textContent = "管理配置";
        menuItem.isadd = true
        menuItem.onclick = function () {

            const loadmenu = window.loadmenu
            if (loadmenu == true) {
                try {
                    选择自定义配置(custom_json[document.querySelectorAll(".myedit")[2].value])
                } catch (e) {
                    console.log(e)
                }
                customdialog.open = true
            } else {
                mdui_snackbar({
                    message: "加载中",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
                loadmenu()
            }

        }

        menudoc.appendChild(menuItem);
    }

    if (localStorage.getItem("custom_cof")) {

        if (Object.keys(custom_json).length == 0) {
            mdui_snackbar({
                message: tip1,
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
            return
        }

        if (ismenu != true) {
            for (item in custom_json) {
                // 使用闭包解决
                (function (item_str) {
                    // 创建新的 mdui-menu-item 元素  
                    var menuItem = document.createElement('mdui-menu-item');
                    // 设置文本内容  
                    menuItem.textContent = item_str;
                    menuItem.onclick = function () {
                        localStorage.setItem("customs", item_str)
                        document.querySelectorAll(".myedit")[2].value = item_str;
                    }
                    // 将新创建的元素添加到 DOM 中，例如添加到 body 中  
                    menudoc.appendChild(menuItem);
                })(item);
            }
        } else {
            for (item in custom_json) {
                // 使用闭包解决
                (function (item_str) {
                    // 创建新的 mdui-menu-item 元素  
                    var menuItem = document.createElement('mdui-menu-item');
                    // 设置文本内容  
                    menuItem.textContent = item_str;
                    menuItem.onclick = function () {
                        localStorage.setItem("customs", item_str)
                        document.querySelectorAll(".myedit")[2].value = item_str;
                        选择自定义配置(custom_json[document.querySelectorAll(".myedit")[2].value])
                    }
                    // 将新创建的元素添加到 DOM 中，例如添加到 body 中  
                    menudoc.appendChild(menuItem);
                })(item);
            }
        }
    } else {
        mdui_snackbar({
            message: tip1,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
        return
    }

}


function 判断出线数值(myvalue) {
    var isdkl
    var iszd
    var isfyl
    var bxmode
    myvalue.forEach(element => {
        if (element.includes("对抗路")) {
            isdkl = true
        } else if (element.includes("中路")) {
            iszd = true
        }
        else if (element.includes("发育路")) {
            isfyl = true
        }
    });

    // 无 0
    if (isdkl != true && iszd != true && isfyl != true) {
        bxmode = 0
        //1 1
    } else if (isdkl && iszd != true && isfyl != true) {
        bxmode = 1
        //2 2
    } else if (isdkl != true && iszd && isfyl != true) {
        bxmode = 2
        //21 3
    } else if (isdkl && iszd && isfyl != true) {
        bxmode = 3
        //3 4
    } else if (isdkl != true && iszd != true && isfyl) {
        bxmode = 4
        //31 5
    } else if (isdkl && iszd != true && isfyl) {
        bxmode = 5
        //32 6
    } else if (isdkl != true && iszd && isfyl) {
        bxmode = 6
        //本段在实际上不存在 为网页设计
    } else if (isdkl && iszd && isfyl) {
        return "null"
    }
    return bxmode
}

function 判断数据(doc) {
    if (doc.value == "") {
        doc.value = 1
    }

    let value = doc.value

    return value
}

function 获取野怪数据(bingxiandoc, func, func2, func3, bingxiandoc2) {
    //先循环五次 出兵路线需要特殊判断
    for (let index = 0; index < 5; index++) {
        if (bingxiandoc2) {
            var mydoc = bingxiandoc[index];
            var mydoc2 = bingxiandoc2[index];
            var mdata = []
            mdata.push(判断数据(mydoc))
            mdata.push(判断数据(mydoc2))
            func(mdata)
        } else {
            var mydoc = bingxiandoc[index];
            var mdata = []
            mdata.push(判断数据(mydoc))
            mdata.push(判断数据(mydoc))
            func(mdata)
        }
    }

    if (bingxiandoc2) {
        var bxvalue = 判断出线数值(bingxiandoc[5].value)
        var bxvalue2 = 判断出线数值(bingxiandoc2[5].value)
        var mdata = []
        mdata.push(bxvalue)
        mdata.push(bxvalue2)
        func2(mdata)
    } else {
        var myvalue = 判断出线数值(bingxiandoc[5].value)
        var mdata = []
        mdata.push(myvalue)
        mdata.push(myvalue)
        func2(mdata)
    }

    //野怪list
    for (let index = 6; index < 8; index++) {
        if (bingxiandoc2) {
            const mydoc = bingxiandoc[index];
            const mydoc2 = bingxiandoc2[index];
            var mdata = []
            mdata.push(判断数据(mydoc))
            mdata.push(判断数据(mydoc2))
            func3(mdata)
        } else {
            const mydoc = bingxiandoc[index];
            var mdata = []
            mdata.push(判断数据(mydoc))
            mdata.push(判断数据(mydoc))
            func3(mdata)
        }
    }
}

function 获取防御塔属性(fytsjdoc, func, func2, func3, fytsjdoc2) {
    //获取防御塔属性
    for (let index = 0; index < 3; index++) {

        if (fytsjdoc2) {
            const mydoc = fytsjdoc[index];
            const mydoc2 = fytsjdoc2[index];
            var mdata = []
            mdata.push(判断数据(mydoc))
            mdata.push(判断数据(mydoc2))
            func(mdata)
        } else {
            const mydoc = fytsjdoc[index];
            var mdata = []
            mdata.push(判断数据(mydoc))
            mdata.push(判断数据(mydoc))
            func(mdata)
        }
    }

    //获取水晶属性
    for (let index = 3; index < 5; index++) {

        if (fytsjdoc2) {
            const mydoc = fytsjdoc[index];
            const mydoc2 = fytsjdoc2[index];
            var mdata = []
            mdata.push(判断数据(mydoc))
            mdata.push(判断数据(mydoc2))
            func2(mdata)
        } else {
            const mydoc = fytsjdoc[index];
            var mdata = []
            mdata.push(判断数据(mydoc))
            mdata.push(判断数据(mydoc))
            func2(mdata)
        }
    }

    func3(判断数据(document.getElementById("mytiao")))

}


function 获取选择自定义名() {

    var bxConfList = []
    var ygConfList = []
    var ygmode = document.getElementsByClassName("setmode")[1].value
    if (ygmode == "all") {

        var bingxiandoc = allputong[1].getElementsByTagName("mdui-select")
        获取野怪数据(bingxiandoc, function (myvalue) {
            bxConfList.push(myvalue)
        }, function (myvalue) {
            bxConfList.push(myvalue)
        }, function (myvalue) {
            ygConfList.push(myvalue)
        })



    } else if (ygmode == "zhenying") {
        var bingxiandoc_blue = zhenyingDocBlue[1].getElementsByTagName("mdui-select")
        var bingxiandoc_red = zhenyingDocRed[1].getElementsByTagName("mdui-select")


        获取野怪数据(bingxiandoc_blue, function (myvalue) {
            bxConfList.push(myvalue)
        }, function (myvalue) {
            bxConfList.push(myvalue)
        }, function (myvalue) {
            ygConfList.push(myvalue)
        }, bingxiandoc_red)

    }

    var fytConfList = []
    var sjConfList = []
    var sjmode = document.getElementsByClassName("setmode")[2].value
    if (sjmode == "all") {

        var fytsjdoc = allputong[2].getElementsByTagName("mdui-select")
        获取防御塔属性(fytsjdoc, function (myvalue) {
            fytConfList.push(myvalue)
        }, function (myvalue) {
            sjConfList.push(myvalue)
        }, function (myvalue) {
            sjConfList.push(myvalue)
        })

    } else if (sjmode == "zhenying") {

        var fytsjdoc_blue = zhenyingDocBlue[2].getElementsByTagName("mdui-select")
        var fytsjdoc_red = zhenyingDocRed[2].getElementsByTagName("mdui-select")

        获取防御塔属性(fytsjdoc_blue, function (myvalue) {
            fytConfList.push(myvalue)
        }, function (myvalue) {
            sjConfList.push(myvalue)
        }, function (myvalue) {
            sjConfList.push(myvalue)
        }, fytsjdoc_red)

    }


    var HeroList = []


    var value = document.getElementsByClassName("setmode")[0].value
    if (value == "zhenying") {

        var bluedoc = document.getElementsByClassName("zhenying_blue")[0].getElementsByTagName("mdui-select")
        var reddoc = document.getElementsByClassName("zhenying_red")[0].getElementsByTagName("mdui-select")
        var HeroList_blue = []
        var HeroList_red = []



        for (let index = 0; index < 6; index++) {
            var herodata_blue = []
            var herodata_red = []
            for (let i = 0; i < 5; i++) {
                herodata_blue.push(判断数据(bluedoc[index]))
                herodata_red.push(判断数据(reddoc[index]))
            }

            HeroList_blue.push(herodata_blue)
            HeroList_red.push(herodata_red)

        }

        HeroList.push(HeroList_blue)
        HeroList.push(HeroList_red)

    } else if (value == "xvanshou") {

        var bluedoc = document.getElementsByClassName("xvanshou_blue")[0].getElementsByTagName("mdui-select")
        var reddoc = document.getElementsByClassName("xvanshou_red")[0].getElementsByTagName("mdui-select")
        var bluelist = document.getElementsByClassName("xvanshou_blue")[0].getElementsByTagName("mdui-list")
        var redlist = document.getElementsByClassName("xvanshou_red")[0].getElementsByTagName("mdui-list")
        var HeroList_blue = []
        var HeroList_red = []


        for (let index = 0; index < 6; index++) {

            var herodata_blue = []
            var herodata_red = []

            for (let i = 0; i < 5; i++) {
                herodata_blue.push(判断数据(bluelist[i].getElementsByTagName("mdui-select")[index]))
                herodata_red.push(判断数据(redlist[i].getElementsByTagName("mdui-select")[index]))
            }

            HeroList_blue.push(herodata_blue)
            HeroList_red.push(herodata_red)

        }

        HeroList.push(HeroList_blue)
        HeroList.push(HeroList_red)


    } else {

        var HeroList_blue = []
        var HeroList_red = []


        for (let index = 0; index < 6; index++) {

            var herodata_blue = []
            var herodata_red = []

            for (let i = 0; i < 5; i++) {
                herodata_blue.push(判断数据(allputong[0].getElementsByTagName("mdui-select")[index]))
                herodata_red.push(判断数据(allputong[0].getElementsByTagName("mdui-select")[index]))
            }

            HeroList_blue.push(herodata_blue)
            HeroList_red.push(herodata_red)

        }

        HeroList.push(HeroList_blue)
        HeroList.push(HeroList_red)


    }

    if (HeroList.length == 0) {
        return null
    }

    var alljson = []
    alljson.push(HeroList)
    alljson.push(bxConfList)
    alljson.push(ygConfList)
    alljson.push(fytConfList)
    alljson.push(sjConfList)

    console.log(alljson)

    return JSON.stringify(alljson)
}

function 设置自定义项目(myindex, endindex, myjson, doc) {
    for (let index = myindex; index < endindex; index++) {
        //将下标改为从0开始
        var i = index - myindex
        var element = myjson[i][0];
        doc[index].value = element;
    }
}

function 设置自定义项目2(myindex, endindex, myjson, doc, doc2) {
    for (let index = myindex; index < endindex; index++) {
        //将下标改为从0开始
        var i = index - myindex
        var element = myjson[i][0];
        doc[index].value = element
        var element = myjson[i][1];
        doc2[index].value = element
    }
}


function 选择自定义配置(json) {
    if (typeof json == "undefined") {
        return
    }

    var alldoc = customdialog.getElementsByTagName("mdui-select")
    for (let index = 0; index < alldoc.length; index++) {
        alldoc[index].value = alldoc[index].defvalue
    }

    var yxvalue = json.yxtype
    var bxvalue = json.bxtype
    var sjvalue = json.sjtype

    document.getElementsByClassName("setmode")[0].value = yxvalue
    document.getElementsByClassName("setmode")[1].value = bxvalue
    document.getElementsByClassName("setmode")[2].value = sjvalue

    var myjson = JSON.parse(json.myjson)
    edittt = document.getElementsByClassName("suijitest")[0].getElementsByTagName("mdui-text-field")
    if (json.adjson) {
        var ccc = json.adjson
        edittt[0].value = ccc[0]
        edittt[1].value = ccc[1]
        edittt[2].data = ccc[2]
        edittt[3].data = ccc[3]
    } else {
        edittt[0].value = ""
        edittt[1].value = ""
        edittt[2].data = ""
        edittt[3].data = ""
    }


    var json_herolist = myjson[0]
    var json_bxlist = myjson[1]
    var json_yglist = myjson[2]
    var json_fytlist = myjson[3]
    var json_sjlist = myjson[4]

    const bxjsonMap = {
        0: [],
        1: ["对抗路"],
        2: ["中路"],
        3: ["对抗路", "中路"],
        4: ["发育路"],
        5: ["对抗路", "发育路"],
        6: ["中路", "发育路"],
        "null": ["对抗路", "中路", "发育路"],
    };

    if (bxvalue == "all") {
        //先循环五次 出兵路线需要特殊判断
        var mduiDoc = allputong[1].getElementsByTagName("mdui-select")
        var myjson = json_bxlist
        var myjson2 = json_yglist
        设置自定义项目(0, 5, myjson, mduiDoc)
        var myvalue = myjson[myjson.length - 1][0]
        mduiDoc[5].value = bxjsonMap[myvalue];
        设置自定义项目(6, 8, myjson2, mduiDoc)
    } else if (bxvalue == "zhenying") {
        var bluedoc = zhenyingDocBlue[1].getElementsByTagName("mdui-select")
        var reddoc = zhenyingDocRed[1].getElementsByTagName("mdui-select")
        var myjson = json_bxlist
        var myjson2 = json_yglist
        设置自定义项目2(0, 5, myjson, bluedoc, reddoc)
        var myvalue = myjson[myjson.length - 1][0]
        bluedoc[5].value = bxjsonMap[myvalue];
        var myvalue = myjson[myjson.length - 1][1]
        reddoc[5].value = bxjsonMap[myvalue];
        设置自定义项目2(6, 8, json_yglist, bluedoc, reddoc)
    }

    if (sjvalue == "all") {
        var myjson = json_fytlist
        var myjson2 = json_sjlist
        var mduiDoc = allputong[2].getElementsByTagName("mdui-select")
        设置自定义项目(0, 3, myjson, mduiDoc)
        设置自定义项目(3, 5, myjson2, mduiDoc)
    } else if (sjvalue == "zhenying") {
        var bluedoc = zhenyingDocBlue[2].getElementsByTagName("mdui-select")
        var reddoc = zhenyingDocRed[2].getElementsByTagName("mdui-select")

        var myjson = json_fytlist
        var myjson2 = json_fytlist

        设置自定义项目2(0, 3, myjson, bluedoc, reddoc)
        设置自定义项目2(3, 5, myjson, bluedoc, reddoc)
    }

    var myvalue = json_sjlist[json_sjlist.length - 1]
    document.getElementById("mytiao").value = myvalue;


    if (yxvalue == "zhenying") {

        var bluedoc = document.getElementsByClassName("zhenying_blue")[0]
        var reddoc = document.getElementsByClassName("zhenying_red")[0]



        for (let index = 0; index < 6; index++) {
            var element = json_herolist[0][index];
            bluedoc.getElementsByTagName("mdui-select")[index].value = element[0]
            var element = json_herolist[1][index];
            reddoc.getElementsByTagName("mdui-select")[index].value = element[0]
        }


    } else if (yxvalue == "xvanshou") {

        var bluelist = document.getElementsByClassName("xvanshou_blue")[0].getElementsByTagName("mdui-list")
        var redlist = document.getElementsByClassName("xvanshou_red")[0].getElementsByTagName("mdui-list")


        for (let index = 0; index < 6; index++) {
            for (let i = 0; i < 5; i++) {
                var element = json_herolist[0][index];
                bluelist[i].getElementsByTagName("mdui-select")[index].value = element[i]
                var element = json_herolist[1][index];
                redlist[i].getElementsByTagName("mdui-select")[index].value = element[i]
            }

        }

    } else {

        for (let index = 0; index < 6; index++) {
            var element = json_herolist[0][index];
            allputong[0].getElementsByTagName("mdui-select")[index].value = element[0]
        }

    }



}


var customButton = document.getElementsByClassName("custombutton")

customButton[0].onclick = function () {
    加载自定义配置()
}

customButton[1].onclick = function () {
    mdui.prompt({
        headline: "新建配置",
        description: "请输入配置名以新建配置",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: (value) => {
            var 自定义名 = 获取选择自定义名()
            var custom_json
            if (localStorage.getItem("custom_cof")) {
                custom_json = JSON.parse(localStorage.getItem("custom_cof"))
            } else {
                custom_json = {}
            }

            if (value == "") {
                var Rand = Math.random()
                var mineId = Math.round(Rand * 100000000)
                value = "未命名" + mineId.toString()
            }
            if (isJSON(value)) {
                mdui.alert({
                    headline: "提示",
                    description: "保存失败 保存配置不可是json 请输入正常字符串",
                    confirmText: "我知道了",
                    onConfirm: () => console.log("confirmed"),
                });
                return
            }

            edittt[0].value = ""
            edittt[1].value = ""
            edittt[2].data = ""
            edittt[3].data = ""

            custom_json[value] = {
                myjson: 自定义名,
                yxtype: document.getElementsByClassName("setmode")[0].value,
                bxtype: document.getElementsByClassName("setmode")[1].value,
                sjtype: document.getElementsByClassName("setmode")[2].value,
                adjson: ["", "", "", ""]
            }
            console.log(custom_json)
            localStorage.setItem("custom_cof", JSON.stringify(custom_json))
            localStorage.setItem("customs", value)
            document.querySelectorAll(".myedit")[2].value = value;
            加载自定义配置()
            mdui_snackbar({
                message: "新建配置成功",
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
        },
        onCancel: () => console.log("canceled"),
    });
}

customButton[2].onclick = function () {
    var 自定义名 = 获取选择自定义名()
    edittt = document.getElementsByClassName("suijitest")[0].getElementsByTagName("mdui-text-field")
    var custom_json = {}
    custom_json = {
        myjson: 自定义名,
        yxtype: document.getElementsByClassName("setmode")[0].value,
        bxtype: document.getElementsByClassName("setmode")[1].value,
        sjtype: document.getElementsByClassName("setmode")[2].value,
        adjson: [edittt[0].value, edittt[1].value, edittt[2].data, edittt[3].data]
    }
    复制文本(JSON.stringify(custom_json))
}

customButton[3].onclick = function () {
    mdui.prompt({
        headline: "导入配置",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: (value) => {
            try {
                选择自定义配置(JSON.parse(value))
                mdui_snackbar({
                    message: tip3,
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
            } catch {
                mdui_snackbar({
                    message: "输入配置有误",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
            }
        },
        onCancel: () => console.log("canceled"),
    });
}

customButton[4].onclick = function () {
    if (localStorage.getItem("custom_cof")) {
        var editvalue = document.querySelectorAll(".myedit")[2].value
        if (JSON.parse(localStorage.getItem("custom_cof"))[editvalue]) {
            mdui.confirm({
                headline: "提示",
                description: "是否删除该配置",
                confirmText: "确认",
                cancelText: "取消",
                onConfirm: () => {
                    var custom_json = JSON.parse(localStorage.getItem("custom_cof"))
                    delete custom_json[editvalue]
                    localStorage.setItem("custom_cof", JSON.stringify(custom_json))
                    localStorage.setItem("customs", "")

                    还原自定义配置()

                    mdui_snackbar({
                        message: "删除配置成功",
                        action: "我知道了",
                        onActionClick: () => console.log("click action button")
                    });
                },
                onCancel: () => console.log("canceled"),
            });
        } else {
            mdui_snackbar({
                message: tip5,
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
        }
    } else {
        mdui_snackbar({
            message: tip2,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
    }
}

customButton[5].onclick = function () {
    if (localStorage.getItem("custom_cof")) {
        var editvalue = document.querySelectorAll(".myedit")[2].value
        if (JSON.parse(localStorage.getItem("custom_cof"))[editvalue]) {
            mdui.prompt({
                headline: "提示",
                description: tip4,
                confirmText: "确认",
                cancelText: "取消",
                onConfirm: (value) => {
                    if (isJSON(value)) {
                        mdui.alert({
                            headline: "提示",
                            description: "保存失败 保存配置不可是json 请输入正常字符串",
                            confirmText: "我知道了",
                            onConfirm: () => console.log("confirmed"),
                        });
                        return
                    }
                    var custom_json = JSON.parse(localStorage.getItem("custom_cof"))
                    var custom_json = 修改键名(custom_json, editvalue, value);
                    localStorage.setItem("custom_cof", JSON.stringify(custom_json))
                    localStorage.setItem("customs", value)
                    document.querySelectorAll(".myedit")[2].value = value
                    加载自定义配置()
                    mdui_snackbar({
                        message: "重命名配置成功",
                        action: "我知道了",
                        onActionClick: () => console.log("click action button")
                    });
                },
                onCancel: () => console.log("canceled"),
            });
        } else {
            mdui_snackbar({
                message: tip5,
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
        }
    } else {
        mdui_snackbar({
            message: tip2,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
    }
}

customButton[6].onclick = function () {
    if (localStorage.getItem("custom_cof")) {
        var editvalue = document.querySelectorAll(".myedit")[2].value
        if (JSON.parse(localStorage.getItem("custom_cof"))[editvalue]) {
            document.getElementsByClassName("suijitest")[0].open = true
        } else {
            mdui_snackbar({
                message: tip5,
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
        }
    } else {
        mdui_snackbar({
            message: tip2,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
    }
}

customButton[7].onclick = function () {
    if (localStorage.getItem("custom_cof")) {
        var editvalue = document.querySelectorAll(".myedit")[2].value
        if (JSON.parse(localStorage.getItem("custom_cof"))[editvalue]) {
            mdui.confirm({
                headline: "提示",
                description: "是否保存该配置",
                confirmText: "确认",
                cancelText: "取消",
                onConfirm: () => {
                    var 自定义名 = 获取选择自定义名()
                    var custom_json = JSON.parse(localStorage.getItem("custom_cof"))
                    edittt = document.getElementsByClassName("suijitest")[0].getElementsByTagName("mdui-text-field")
                    custom_json[editvalue] = {
                        myjson: 自定义名,
                        yxtype: document.getElementsByClassName("setmode")[0].value,
                        bxtype: document.getElementsByClassName("setmode")[1].value,
                        sjtype: document.getElementsByClassName("setmode")[2].value,
                        adjson: [edittt[0].value, edittt[1].value, edittt[2].data, edittt[3].data]
                    }
                    localStorage.setItem("custom_cof", JSON.stringify(custom_json))
                    mdui_snackbar({
                        message: "保存配置成功",
                        action: "我知道了",
                        onActionClick: () => console.log("click action button")
                    });
                },
                onCancel: () => console.log("canceled"),
            });
        } else {
            mdui_snackbar({
                message: tip5,
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
        }
    } else {
        mdui_snackbar({
            message: tip2,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
    }
}

function 还原自定义配置() {
    var alldoc = customdialog.getElementsByTagName("mdui-select")
    for (let index = 0; index < alldoc.length; index++) {
        alldoc[index].value = alldoc[index].defvalue
    }
    edittt[0].value = ""
    edittt[1].value = ""
    edittt[2].data = ""
    edittt[3].data = ""
    customdialog.querySelector("mdui-tab").click()
    customdialog.bodyRef.value.scroll({ top: 0, behavior: 'smooth' });
}

customButton[8].onclick = function () {
    mdui.confirm({
        headline: "提示",
        description: "是否还原？",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: () => {
            还原自定义配置()
            mdui_snackbar({
                message: "还原成功",
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
        },
        onCancel: () => console.log("canceled"),
    });
}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            console.log('error：' + str + '!!!' + e);
            return false;
        }
    }
    console.log('It is not a string!')
}

edittt = document.getElementsByClassName("suijitest")[0].getElementsByTagName("mdui-text-field")

function checkpeiload() {
    peiedit = document.getElementsByClassName("peiedit")[0]
    const createcustom_tab = window.createcustom_tab
    if (createcustom_tab == true) {
        peiedit.open = true
    } else {
        mdui_snackbar({
            message: "加载中",
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
        createcustom_tab(peiedit)
    }
}

edittt[2].onclick = function () {
    window.peimode = 2
    checkpeiload()
}
edittt[3].onclick = function () {
    window.peimode = 3
    checkpeiload()
}

function entclick() {
    var custom_json = JSON.parse(localStorage.getItem("custom_cof"))
    if (edittt[0].value != "" && typeof mydatajson[0][edittt[0].value] == "undefined") {
        mdui.alert({
            headline: "提示",
            description: "不支持的地图名称",
            confirmText: "我知道了",
            onConfirm: () => console.log("confirmed"),
        });
        return
    }

    if (typeof custom_json[document.querySelectorAll(".myedit")[2].value]["adjson"] == "undefined") {
        custom_json[document.querySelectorAll(".myedit")[2].value]["adjson"] = ["", "", "", ""]
    }
    custom_json[document.querySelectorAll(".myedit")[2].value]["adjson"][0] = edittt[0].value
    custom_json[document.querySelectorAll(".myedit")[2].value]["adjson"][1] = edittt[1].value
    localStorage.setItem("custom_cof", JSON.stringify(custom_json))
    document.getElementsByClassName("suijitest")[0].open = false;
    mdui_snackbar({
        message: "保存成功",
        action: "我知道了",
        onActionClick: () => console.log("click action button")
    });

}

function getHexBackgroundColor(element) {
    // 获取元素的 background-color
    var computedStyles = window.getComputedStyle(element);
    var backgroundColor = computedStyles.getPropertyValue('background-color');

    // 检查是否为 RGB 或 RGBA 格式，如果是，转换为十六进制
    if (backgroundColor.match(/^rgb/) || backgroundColor.match(/^rgba/)) {
        // 提取 RGB 值
        var rgbValues = backgroundColor.match(/\d+/g).map(Number);
        // 转换为十六进制
        var hexColor = rgbValues.map(function (value) {
            return ('0' + value.toString(16)).slice(-2);
        }).join('');
        backgroundColor = '#' + hexColor;
    }

    return backgroundColor;
}

var colordoc = document.getElementsByClassName("color-preset")[0].childNodes

colordoc.forEach(element => {
    element.onclick = function () {

        if (color_message != "null") {
            mdui_snackbar({
                message: color_message,
                action: "我知道了",
                onActionClick: () => console.log("click action button")
            });
            return
        }

        color = getHexBackgroundColor(this)
        localStorage.setItem("wzzdy_mythemecolor", color)
        mdui.setColorScheme(color)
    }
});

document.getElementsByClassName('color-custom')[0].addEventListener('click', function (event) {
    if (color_message != "null") {
        mdui_snackbar({
            message: color_message,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
        event.preventDefault()
    }
});

document.getElementsByClassName("color-custom")[0].addEventListener('input', function () {
    color = this.value;
    localStorage.setItem("wzzdy_mycustomthemecolor", color)
    localStorage.setItem("wzzdy_mythemecolor", color)
    mdui.setColorScheme(color)
});

color_message = "null"

document.getElementsByClassName('color-img')[0].addEventListener('click', function (event) {
    if (color_message != "null") {
        mdui_snackbar({
            message: color_message,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
        event.preventDefault()
        return
    }
});

document.getElementsByClassName('color-img')[0].addEventListener('input', function () {

    if (this.files && this.files[0]) {
        color_message = "正在从壁纸提取颜色中 请耐心等待"
        const file = this.files[0];

        const reader = new FileReader();

        reader.onloadend = function () {
            const image = new Image();
            const blobUrl = URL.createObjectURL(file);
            image.src = blobUrl;
            mdui.getColorFromImage(image).then(color => {
                //清理blob
                URL.revokeObjectURL(blobUrl);
                //清空选择 防止重复选择不触发
                document.getElementsByClassName('color-img')[0].value = ""
                localStorage.setItem("wzzdy_mythemecolor", color)
                mdui.setColorScheme(color)
                color_message = "null"
                mdui_snackbar({
                    message: "从壁纸设置主题成功",
                    action: "我知道了",
                    onActionClick: () => console.log("click action button")
                });
            });

        };

        reader.readAsDataURL(file); // 开始读取文件内容
    }
})

document.getElementsByClassName("colorbutton")[0].onclick = function () {

    if (color_message != "null") {
        mdui_snackbar({
            message: color_message,
            action: "我知道了",
            onActionClick: () => console.log("click action button")
        });
        return
    }

    localStorage.setItem("wzzdy_mythemecolor", "null")
    mdui.removeColorScheme()
}

function bindsearch(view) {
    view.addEventListener("input", function () {
        childnodes = view.parentElement.getElementsByTagName("mdui-menu-item");
        for (let i = 0; i < childnodes.length; i++) {
            if (childnodes[i].isadd == true) {
                continue
            }
            let value = childnodes[i].textContent;
            if (value.includes(this.value)) {
                childnodes[i].style.display = "";
            } else {
                childnodes[i].style.display = "none";
            }
        }
    })
    view.parentElement.parentElement.addEventListener("closed", function () {
        childnodes = view.parentElement.getElementsByTagName("mdui-menu-item");
        //退出清空输入框
        view.value = ""

        for (let i = 0; i < childnodes.length; i++) {
            childnodes[i].style.display = "";
        }

    })
}

const allsearchview = document.getElementsByClassName("search_edit");
for (let i = 0; i < allsearchview.length; i++) {
    bindsearch(allsearchview[i]);
}


const search_heroedit = document.getElementsByClassName("search_heroedit")[0];
search_heroedit.addEventListener("input", function () {

    const view = search_heroedit
    let childnodes = view.parentElement.getElementsByClassName("myherolist")[0].childNodes;
    for (let i = 0; i < childnodes.length; i++) {
        if (childnodes[i].isshow == false) {
            continue
        }
        let value = childnodes[i].textContent;
        if (value.includes(view.value)) {
            childnodes[i].style.display = "";
        } else {
            childnodes[i].style.display = "none";
        }
    }
})

var mysnackbar = false;
function mdui_snackbar(args) {
    if (mysnackbar && mysnackbar.style.display != "none") {
        mysnackbar.remove()
    }
    mysnackbar = mdui.snackbar(args);
}

function createcheckbox(array, ele, defvalue, menu_item) {
    defvalue = defvalue.split(',')
    if (menu_item == null) {
        menu_item = Array.from({ length: array.length }, (_, index) => `${index + 1}`);
    }
    for (let index = 0; index < array.length; index++) {
        // 创建 mdui-checkbox
        var checkbox = document.createElement('mdui-checkbox');
        const value = menu_item[index].toString()
        checkbox.setAttribute('value', value);
        const element = array[index];
        checkbox.innerText = element;
        if (defvalue.includes(value)) {
            checkbox.checked = true
        }
        ele.appendChild(checkbox);
    }
}

function getIndexByTagName(element, parent) {
    if (!parent) parent = element.parentElement;


    // 过滤出具有指定tagName的子元素
    const siblingsWithTag = parent.getElementsByTagName(element.tagName.toLowerCase());

    // 找到当前元素在筛选后数组中的索引
    const index = [...siblingsWithTag].indexOf(element);

    return index !== -1 ? index : undefined; // 如果找到了就返回索引，否则返回undefined
}


function showeditdia(textv, func, ele) {
    let tabPanel = textv.parentElement.parentElement;
    let mindex = 0
    let radiodiv
    let result = ""
    let value


    let allnum = textv.allnum || tabPanel.allnum

    let step

    let allstr = []

    if (peimode == 2) {
        step = [
            "随机生成范围", function () {
                createcheckbox(textv.menu, radiodiv, value[0], textv.menu_item)
            },
        ]
    } else if (peimode == 3) {

        var customjson = JSON.parse(localStorage.getItem("custom_cof"))
        var myjson = JSON.parse(customjson[document.querySelectorAll(".myedit")[2].value].myjson)
        var json_herolist = myjson[0]
        var json_bxlist = myjson[1]
        var json_yglist = myjson[2]
        var json_fytlist = myjson[3]
        var json_sjlist = myjson[4]
        let list_pos = getIndexByTagName(textv.parentElement, tabPanel.parentElement);
        let textv_pos = getIndexByTagName(textv.parentElement);
        let alltab = []

        if (list_pos == 0) {
            //位置 属性的对应关系
            let blue = json_herolist[0][textv_pos]
            let red = json_herolist[1][textv_pos]
            alltab = [...blue, ...red]
        } else if (list_pos == 1) {
            let mydata = json_bxlist[textv_pos]
            //属性 位置的对应关系
            alltab = [mydata[0], mydata[1]]
        } else if (list_pos == 2) {
            let mydata = json_yglist[textv_pos]
            //属性 位置的对应关系
            alltab = [mydata[0], mydata[1]]
        } else if (list_pos == 3) {
            let mydata = json_fytlist[textv_pos]
            //属性 位置的对应关系
            alltab = [mydata[0], mydata[1]]
        } else if (list_pos == 4) {
            let mydata = json_sjlist[textv_pos]
            //属性 位置的对应关系
            alltab = [mydata[0], mydata[1]]
        } else if (list_pos == 5) {
            //胜利条件
            let mydata = json_sjlist[textv_pos]
            //属性 位置的对应关系
            alltab = [mydata]
        }

        allstr = alltab.map((char, index) => allnum[index] + " " + textv.menu[char - 1]);

        step = [
            "随机打乱范围", function () {
                createcheckbox(allstr, radiodiv, value[0])
                //跳过第二项的设置
                mindex++
            },
        ]
    }

    if (ele && ele.data) {
        value = ele.data.split(":")
    } else {
        value = ["", ""]
    }

    let dia = mdui.dialog({
        headline: "提示",
        description: step[0],
        body: '<p>如显示不全可向下滑动查看更多内容</p><div class="radiodiv"></div>',
        onOpen: (dia) => {
            radiodiv = dia.getElementsByClassName("radiodiv")[0]
            step[1]()
        },
        actions: [
            {
                text: "返回",
                onClick: () => {
                    return true;
                },
            },
            {
                text: "删除",
                onClick: () => {
                    if (ele == null) {
                        mdui_snackbar({
                            message: "你必须要创建配置后才能删除",
                            action: "我知道了",
                            onActionClick: () => console.log("click action button")
                        });
                        return false
                    }
                    ele.remove()
                    return true;
                },
            },
            {
                text: "全选",
                onClick: () => {
                    var childnodes = radiodiv.childNodes
                    for (let index = 0; index < childnodes.length; index++) {
                        const element = childnodes[index];
                        element.checked = true
                    }
                    return false;
                },
            },
            {
                text: "下一步",
                onClick: () => {
                    var childnodes = radiodiv.childNodes
                    let valuetab = []
                    let localstr

                    for (let index = 0; index < childnodes.length; index++) {
                        const element = childnodes[index];
                        if (element.checked == true) {
                            valuetab.push(element.value);
                        }
                    }

                    if ((mindex == 0 || peimode == 3) && valuetab.length < 2) {
                        if (childnodes.length == 1) {
                            mdui_snackbar({
                                message: "该项不支持设置该操作 请返回选择其他选项",
                                action: "我知道了",
                                onActionClick: () => console.log("click action button")
                            });
                            return false
                        }
                        mdui_snackbar({
                            message: "你必须至少选择两个选项",
                            action: "我知道了",
                            onActionClick: () => console.log("click action button")
                        });
                        return false
                    } else if (valuetab.length == 0) {
                        mdui_snackbar({
                            message: "你必须至少选择一个选项",
                            action: "我知道了",
                            onActionClick: () => console.log("click action button")
                        });
                        return false
                    }
                    mindex++
                    for (let index = 0; index < childnodes.length; index++) {
                        const element = childnodes[index];
                        element.remove()
                        index--
                    }

                    localstr = valuetab.join(',');
                    if (mindex == 1) {
                        dia.description = "作用位置设置"
                        result = localstr
                        createcheckbox(allnum, radiodiv, value[1])
                        return false
                    } else {

                        if (result == "") {
                            result = localstr
                        } else {
                            result = result + ":" + localstr
                        }

                        func(result)
                    }
                },
            }
        ],
    })

}

function addchipitem(data, textv, ele) {
    const listItem = document.createElement('mdui-chip');
    listItem.elevated = true;
    listItem.className = "mychip";
    listItem.textContent = "一个配置";
    listItem.data = data;
    listItem.onclick = function () {
        showeditdia(textv, function (result) {
            listItem.data = result
        }, listItem)
    }
    ele.appendChild(listItem)
}

function createcustom_tab(ele) {
    var customdia = document.getElementsByClassName("custom-dialog")[0]
    var tabs = customdia.getElementsByTagName("mdui-tabs")[0]


    // 创建tabs容器
    var tabsContainer = document.createElement('mdui-tabs');

    var alltab = tabs.getElementsByTagName("mdui-tab")
    let pos = 1

    for (let index = 0; index < alltab.length; index++) {
        let tabele = alltab[index]

        var tab = document.createElement('mdui-tab');
        tab.setAttribute('value', tabele.value);
        tab.textContent = tabele.textContent;

        tabpanel = tabs.getElementsByTagName("mdui-tab-panel")[index]

        // 创建mdui-tab-panel元素
        var tabPanel = document.createElement('mdui-tab-panel');
        tabPanel.setAttribute('slot', 'panel');
        tabPanel.setAttribute('value', tabele.value);


        const orilist = tabpanel.getElementsByClassName("putong")[0];

        var newlist = orilist.cloneNode(true);

        //循环到第三页时添加胜利条件
        if (index == 2) {
            let endlist = document.querySelector("#mytiao").parentElement.cloneNode(true)
            newlist.appendChild(endlist)
        }


        // 获取所有的mdui-select元素
        var selects = newlist.querySelectorAll('mdui-select');

        selects.forEach(function (select) {
            // 创建一个新的mdui-text-field元素
            var textField = document.createElement('mdui-text-field');

            textField.className = "myedit";
            textField.label = select.label;
            textField.variant = select.variant;
            textField.value = "点击编辑配置";
            textField.readonly = true

            const select_menu = select.querySelectorAll("mdui-menu-item")
            const menu = []

            select_menu.forEach(element => {
                const text = element.textContent
                menu.push(text)
            });

            textField.menu = menu
            textField.menu_item = Array.from({ length: menu.length }, (_, index) => `${index + 1}`);
            //出兵路线特殊判断
            if (select.label == "出兵路线") {
                textField.menu = [
                    ["不出兵"],
                    ["对抗路"],
                    ["中路"],
                    ["对抗路 中路"],
                    ["发育路"],
                    ["对抗路 发育路"],
                    ["中路 发育路"],
                    ["对抗路 中路 发育路"],
                ];
                textField.menu_item = [0, 1, 2, 3, 4, 5, 6, "null"]
            } else if (select.label == "胜利条件") {
                textField.allnum = ["全体"]
            }
            textField.pos = pos
            pos++


            textField.onclick = function () {
                const textv = textField
                var custom_json = JSON.parse(localStorage.getItem("custom_cof"))
                let peiz
                try {
                    peiz = JSON.parse(custom_json[document.querySelectorAll(".myedit")[2].value].adjson[peimode])[textv.pos]
                } catch {
                    if (typeof custom_json[document.querySelectorAll(".myedit")[2].value].adjson == "undefined") {
                        custom_json[document.querySelectorAll(".myedit")[2].value].adjson = ["", "", "", ""]
                    }
                }
                if (typeof peiz == "undefined") {
                    peiz = []
                }

                let oridia = mdui.dialog({
                    headline: "提示",
                    description: "你可新建或点击配置卡片编辑配置",
                    body: '<mdui-button variant="filled" class="mdia" full-width>点击新建</mdui-button>',
                    onOpen: (dia) => {

                        for (let index = 0; index < peiz.length; index++) {
                            const element = peiz[index];
                            addchipitem(element, textv, oridia)
                        }

                        let mdia = dia.getElementsByClassName("mdia")[0]
                        mdia.onclick = function () {
                            showeditdia(textv, function (result) {
                                addchipitem(result, textv, oridia)
                            })
                        }

                    },
                    actions: [
                        {
                            text: "返回",
                            onClick: () => {
                                return true;
                            },
                        },
                        {
                            text: "保存",
                            onClick: () => {

                                var chips = oridia.getElementsByTagName("mdui-chip")
                                var results = []
                                for (let index = 0; index < chips.length; index++) {
                                    const element = chips[index];
                                    results.push(element.data)
                                }
                                let pos = (textv.pos).toString()

                                try {
                                    let oridata = JSON.parse(custom_json[document.querySelectorAll(".myedit")[2].value].adjson[peimode])
                                    if (results.length == 0) {
                                        delete oridata[pos]
                                    } else {
                                        oridata[pos] = results
                                    }
                                    let result = JSON.stringify(oridata)
                                    custom_json[document.querySelectorAll(".myedit")[2].value].adjson[peimode] = result
                                } catch {
                                    let json = {}
                                    if (results.length == 0) {
                                        delete json[pos]
                                    } else {
                                        json[pos] = results
                                    }
                                    let result = JSON.stringify(json)
                                    custom_json[document.querySelectorAll(".myedit")[2].value].adjson[peimode] = result
                                }

                                edittt[peimode].data = custom_json[document.querySelectorAll(".myedit")[2].value].adjson[peimode]
                                localStorage.setItem("custom_cof", JSON.stringify(custom_json))
                                textv.value = "点击编辑配置 共有" + results.length + "个配置"
                                console.log(custom_json[document.querySelectorAll(".myedit")[2].value].adjson)
                            },
                        }
                    ],
                })
            }



            // 将textField替换select
            select.parentNode.replaceChild(textField, select);
        })

        var alllist = newlist.getElementsByTagName("mdui-list")

        for (let i = 0; i < alllist.length; i++) {
            const element = alllist[i];
            tabPanel.appendChild(element)
            //getElementsByTagName返回的会动态更改 appendChild会删除原元素 必须减一
            i--
        }


        if (tabpanel.querySelector(".xvanshou") != null) {
            const array = Array.from({ length: 10 }, (_, index) => `位置${index + 1}`);
            tabPanel.allnum = array
        } else if (tabpanel.querySelector(".zhenying") != null) {
            tabPanel.allnum = ["蓝方", "红方"]
        } else {
            tabPanel.allnum = ["全体"]
        }
        tabsContainer.appendChild(tab);
        tabsContainer.appendChild(tabPanel);
    }
    ele.appendChild(tabsContainer)
    tabsContainer.getElementsByTagName("mdui-tab-panel")[2]
    window.createcustom_tab = true
    ele.open = true
    ele.addEventListener("open", function () {
        ele.querySelector("mdui-tab").click()

        // 获取所有的mdui-text-field元素
        var textFields = ele.querySelectorAll('mdui-text-field');
        let index = 0

        textFields.forEach(function (textField) {

            edittt = document.getElementsByClassName("suijitest")[0].getElementsByTagName("mdui-text-field")
            var custom_json = JSON.parse(localStorage.getItem("custom_cof"))
            try {
                var adjson = JSON.parse(custom_json[document.querySelectorAll(".myedit")[2].value].adjson[peimode])
                textField.value = "点击编辑配置 共有" + adjson[index + 1].length + "个配置"
            } catch {
                textField.value = "点击编辑配置 共有0个配置"
            }
            index++

        })

        ele.updateComplete.then(() => {
            ele.bodyRef.value.scrollTop = 0;
        })
    })

    ele.addEventListener("close", function () {

        edittt = document.getElementsByClassName("suijitest")[0].getElementsByTagName("mdui-text-field")
        var custom_json = JSON.parse(localStorage.getItem("custom_cof"))
        try {
            let adstr = custom_json[document.querySelectorAll(".myedit")[2].value].adjson[peimode]
            if (adstr == "{}") {
                custom_json[document.querySelectorAll(".myedit")[2].value].adjson[peimode] = ""
                localStorage.setItem("custom_cof", JSON.stringify(custom_json))
            }
            edittt = document.getElementsByClassName("suijitest")[0].getElementsByTagName("mdui-text-field")
            edittt[peimode].value = "点击编辑配置 共有" + Object.keys(JSON.parse(adstr)).length + "个配置"
        } catch {
            edittt[peimode].value = "点击编辑配置 共有0个配置"
        }

    })

}

document.getElementsByClassName("suijitest")[0].addEventListener("open", function () {
    edittt = document.getElementsByClassName("suijitest")[0].getElementsByTagName("mdui-text-field")
    var custom_json = JSON.parse(localStorage.getItem("custom_cof"))
    var adjson = custom_json[document.querySelectorAll(".myedit")[2].value].adjson

    try {
        edittt[2].value = "点击编辑配置 共有" + Object.keys(JSON.parse(adjson[2])).length + "个配置"
    } catch {
        edittt[2].value = "点击编辑配置 共有0个配置"
    }

    try {
        edittt[3].value = "点击编辑配置 共有" + Object.keys(JSON.parse(adjson[3])).length + "个配置"
    } catch {
        edittt[3].value = "点击编辑配置 共有0个配置"
    }

})
