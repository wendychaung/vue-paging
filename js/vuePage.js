(function(){
	var tm = '<div class="page-bar clearfix">'+
		'<ul>'+
		'<li ><a v-on:click="btnclick(1,page_size)" class="btn">&lt;&lt;</a></li>'+
		'<li ><a v-on:click="btnclick(cur-1,page_size)" class="btn">&lt;</a></li>'+
		'<li v-for="index in indexs"  v-bind:class="{ active: cur == index}">'+
		'<a v-on:click="btnclick(index,page_size)">{{ index }}</a>'+
		'</li>'+
		'<li v-if="cur+2<all && indexs[indexs.length-1] < all"><a class="elps">...</a></li>'+
		'<li  v-if="cur+2<all && indexs[indexs.length-1] < all">'+
		'<a v-on:click="btnclick(all,page_size)">{{ all }}</a>'+
		'</li>'+
		'<li v-if="cur!=all && all != 0"><a v-on:click="btnclick(cur+1,page_size)" class="btn">&gt;</a></li>'+
		'<li v-if=" all != 0"><a v-on:click="btnclick(all,page_size)" class="btn">&gt;&gt;</a></li>'+
		'<li><a>共<i>{{all}}</i>页</a></li>'+
		'<li><a>共<i>{{total_count}}</i>条</a></li>'+
		'<li class="goto" >跳转到<input type="text" class="pageIpt"  @keyup.enter="btnclick2()" :value="cur">页</li>'+
		'<select class="pageS" @change="btnclick3()">'+
		'<option value="10">10</option>'+
		'<option value="20">20</option>'+
		'<option value="50">50</option>'+
		'<option value="100">100</option>'+
		'</select>'+
		'</ul>'+
		'</div>';
	var navBar = Vue.extend({
		template: tm,
		props: ['cur', 'all','total_count','page_size'],
		data: function(){},
		computed: {
			indexs: function(){
				var currentPage=parseInt(this.cur);
				var left = 1;
				var right = this.all;
				var ar = [] ;
				if(this.all>= 5){
					if(currentPage > 3 && currentPage < this.all-1){
						left = currentPage - 3;
						right = currentPage +1;
					}else{
						if(currentPage<=3){
							left = 1;
							right = 5;
						}else{
							right = this.all;
							left = this.all -4;
						}
					}
				}
				while (left <= right){
					ar.push(left);
					left ++
				}
				return ar
			},
			curShow:function () {
				if(!isNaN(this.cur)) {
					if (this.cur > this.all) {
						this.cur = this.all;
					}
					else if (this.cur == 0) {
						this.cur = 1;
					}
				}
				else{
					this.cur=1;
				}
			}
		},
		methods: {
			btnclick: function(data,ps){
				if(data != this.cur){
					this.cur = data;
					this.$emit('btnclick',this.cur+","+ps);
				}
			},
			btnclick3: function(data){
				this.$emit('btnclick',this.cur+","+$(".pageS").val());
			},
			btnclick2: function(){
				var goPage=parseInt($(".pageIpt").val());
				this.$emit('btnclick',this.cur+","+this.page_size);
				if(goPage != this.cur){
					if(goPage > this.all){
						this.cur = this.all;
						this.$emit('btnclick',this.cur+","+this.page_size);
						$(".pageIpt").val(this.all);
					}else{
						this.cur = goPage;
						this.$emit('btnclick',goPage+","+this.page_size);
					}
				}
			}
		}
	});
	window.Vnav = navBar
	
})();
