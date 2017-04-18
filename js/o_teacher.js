
	var myUrl="json/teacher.json";

$(function () {
	var myData=initData();
	var vm = new Vue({
		el: '#webbar',
		data:{
			cur:myData.cur_page,
			all:myData.page_count,
			page_size:myData.page_size,
			total_count:myData.total_count,
			dataList:myData.rows
		},
		components:{
			'vue-nav': Vnav
		},
		methods:{
			listens:function(data){
				this.cur=parseInt(data.split(",")[0]);
				this.page_size=parseInt(data.split(",")[1]);
				vm.refreshData();
			},
			refreshData: function () {
				var mydata={
					toPage:this.cur,
					pageSize:this.page_size
				};
				var myj=initData(mydata);
				this.page_size=myj.page_size;
				this.total_count=myj.total_count;
				this.dataList=myj.rows;
			}
		}
	});
});
function initData(myjson) {
	var mydata;
	$.ajax({
		url:myUrl,
		data:myjson,
		type: "GET",
		dataType: 'json',
		async:false
	}).done(function (data) {
		if(data.result == "true" ){
			mydata=data;
		}
	});
	return mydata;
}

