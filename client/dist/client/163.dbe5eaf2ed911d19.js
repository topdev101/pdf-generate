"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[163],{2163:(M,d,a)=>{a.r(d),a.d(d,{ProfileModule:()=>C});var c=a(9174),e=a(5e3),u=a(3264),g=a(3651),p=a(2382);let f=(()=>{class t{constructor(o,n){this.us=o,this.auth=n,this.close=()=>{},this.oldPass="",this.newPass=""}ngOnInit(){document.body.classList.add("_modal-small")}changePassword(){this.auth.ChangePassword(this.newPass)}ngOnDestroy(){document.body.classList.remove("_modal-small")}}return t.\u0275fac=function(o){return new(o||t)(e.Y36(u.KD),e.Y36(g.e))},t.\u0275cmp=e.Xpm({type:t,selectors:[["security"]],decls:17,vars:2,consts:[[2,"padding","25px"],[1,"row"],[1,"col-2"],[1,"w-forms"],[1,"w-forms__title"],["type","text","name","old","placeholder","Type Password",1,"w-forms__input",3,"ngModel","ngModelChange"],["type","text","name","new","placeholder","Type Password",1,"w-forms__input",3,"ngModel","ngModelChange"],[2,"display","flex","justify-content","flex-end"],[1,"change-btn",3,"click"]],template:function(o,n){1&o&&(e.TgZ(0,"div",0)(1,"h3"),e._uU(2,"Change password"),e.qZA(),e.TgZ(3,"div",1)(4,"div",2)(5,"label",3)(6,"span",4),e._uU(7,"Old password"),e.qZA(),e.TgZ(8,"input",5),e.NdJ("ngModelChange",function(r){return n.oldPass=r}),e.qZA()()(),e.TgZ(9,"div",2)(10,"label",3)(11,"span",4),e._uU(12,"New password"),e.qZA(),e.TgZ(13,"input",6),e.NdJ("ngModelChange",function(r){return n.newPass=r}),e.qZA()()()(),e.TgZ(14,"div",7)(15,"button",8),e.NdJ("click",function(){return n.changePassword(),n.close()}),e._uU(16,"Change"),e.qZA()()()),2&o&&(e.xp6(8),e.Q6J("ngModel",n.oldPass),e.xp6(5),e.Q6J("ngModel",n.newPass))},directives:[p.Fj,p.JJ,p.On],styles:["h3[_ngcontent-%COMP%]{margin-bottom:15px}.w-btn[_ngcontent-%COMP%]{margin:20px 0 0}.w-forms[_ngcontent-%COMP%]{display:block;margin-bottom:10px;display:flex;flex-direction:column}.change-btn[_ngcontent-%COMP%]{padding:10px;cursor:pointer;outline:none;border:none;background:#FFA500;color:#fff;margin-top:25px}.change-btn[_ngcontent-%COMP%]:hover{background:#ffa60080}"]}),t})();var m=a(3071),h=a(5612),s=a(5852);const _=[{path:"",component:(()=>{class t{constructor(o,n,i,r){this.us=o,this.modal=n,this.auth=i,this.router=r}change_password(){this.modal.show({component:f})}logOut(){this.auth.SignOut(),this.router.navigate(["/auth"])}}return t.\u0275fac=function(o){return new(o||t)(e.Y36(m.K),e.Y36(h.Z7),e.Y36(g.e),e.Y36(s.F0))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-profile"]],decls:31,vars:5,consts:[[1,"profile-wrapper"],[1,"profile"],[1,"profile-header"],[1,"profile-body"],[1,"profile-left"],[1,"waw-input","mb15"],["type","text","name","name","placeholder","Your name",3,"ngModel","ngModelChange"],["type","tel","name","number","placeholder","Phone number",3,"ngModel","ngModelChange"],[1,"waw-textarea"],[1,"waw__label"],["name","bio","placeholder","Bio",1,"_mh150",3,"ngModel","ngModelChange"],[1,"profile-right"],[1,"profile-right__img"],["width","50","height","50","alt","",3,"src"],[1,"profile-right__img__upload"],[1,"material-icons"],["type","file","name","file","accept","image/*",3,"hidden","change"],[1,"profile-logout",2,"display","flex","flex-direction","column"],[1,"waw-btn_danger",3,"click"],[2,"padding-top","25px","color","#1972f5",3,"click"]],template:function(o,n){1&o&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2),e._uU(3,"Profile Settings"),e.qZA(),e.TgZ(4,"div",3)(5,"div",4)(6,"div",5)(7,"span"),e._uU(8,"Name"),e.qZA(),e.TgZ(9,"input",6),e.NdJ("ngModelChange",function(r){return n.us.data.name=r})("ngModelChange",function(){return n.us.update()}),e.qZA()(),e.TgZ(10,"div",5)(11,"span"),e._uU(12,"Phone number"),e.qZA(),e.TgZ(13,"input",7),e.NdJ("ngModelChange",function(r){return n.us.data.phone=r})("ngModelChange",function(){return n.us.update()}),e.qZA()(),e.TgZ(14,"div",8)(15,"span",9),e._uU(16,"Bio"),e.qZA(),e.TgZ(17,"textarea",10),e.NdJ("ngModelChange",function(r){return n.us.data.bio=r})("ngModelChange",function(){return n.us.update()}),e.qZA()()(),e.TgZ(18,"div",11)(19,"div",12),e._UZ(20,"img",13),e.TgZ(21,"label",14)(22,"div")(23,"i",15),e._uU(24,"+"),e.qZA()(),e.TgZ(25,"input",16),e.NdJ("change",function(r){return n.us.changeAvatar(r)}),e.qZA()()(),e.TgZ(26,"div",17)(27,"button",18),e.NdJ("click",function(){return n.logOut()}),e._uU(28,"Logout"),e.qZA(),e.TgZ(29,"a",19),e.NdJ("click",function(){return n.change_password()}),e._uU(30,"Change password"),e.qZA()()()()()()),2&o&&(e.xp6(9),e.Q6J("ngModel",n.us.data.name),e.xp6(4),e.Q6J("ngModel",n.us.data.phone),e.xp6(4),e.Q6J("ngModel",n.us.data.bio),e.xp6(3),e.Q6J("src",n.us.avatarUrl,e.LSH),e.xp6(5),e.Q6J("hidden",!0))},directives:[p.Fj,p.JJ,p.On],styles:[".profile-wrapper[_ngcontent-%COMP%]{display:flex;justify-content:center;height:calc(100vh - 70px);overflow:auto}.profile[_ngcontent-%COMP%]{background:#FFFFFF;border-radius:10px;max-width:900px;width:100%;padding-top:70px}.profile-header[_ngcontent-%COMP%]{font-weight:700;font-size:16px;text-transform:uppercase;color:orange;padding:20px}.profile-body[_ngcontent-%COMP%]{padding:40px;display:flex;justify-content:space-between}@media (max-width: 699px){.profile-body[_ngcontent-%COMP%]{flex-direction:column;justify-content:center}.profile-body[_ngcontent-%COMP%]   .profile-left[_ngcontent-%COMP%]{order:2;margin-right:0}.profile-body[_ngcontent-%COMP%]   .profile-logout[_ngcontent-%COMP%]{margin-bottom:40px}}.profile-left[_ngcontent-%COMP%]{flex-grow:1;margin-right:40px;display:flex;flex-direction:column;width:100%;max-width:400px}.profile[_ngcontent-%COMP%]   .waw-input[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding-top:10px}.profile[_ngcontent-%COMP%]   .waw-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{padding:10px}.profile[_ngcontent-%COMP%]   .waw-textarea[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding-top:25px}.profile[_ngcontent-%COMP%]   .waw-textarea[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{padding:30px}.profile-right[_ngcontent-%COMP%]{text-align:center}.profile-right__img[_ngcontent-%COMP%]{position:relative;display:block;width:165px;height:170px;margin-left:auto;margin-right:auto;border-radius:50%;padding:5px;border:1px solid #e6e6e6}.profile-right__img[_ngcontent-%COMP%]:hover   .profile-right__img__upload[_ngcontent-%COMP%]{transition:.4s all ease-in-out;transform:scale(1)}.profile-right__img__upload[_ngcontent-%COMP%]{cursor:pointer;position:absolute;width:100%;height:100%;top:0;display:flex;justify-content:center;align-items:center;background:#4d61fc7d;border-radius:50%;left:0;transition:.4s all ease-in-out;transform:scale(0)}.profile-right__img__upload[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:#fff;font-size:50px}.profile-right__img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%;object-fit:cover;border-radius:50%}.profile-logout[_ngcontent-%COMP%]{margin-top:40px;text-align:center}.profile[_ngcontent-%COMP%]   .waw-btn_danger[_ngcontent-%COMP%]{padding:7px 15px 7px 17px;cursor:pointer;border:none;background:#FFA500;color:#fff}.profile[_ngcontent-%COMP%]   .waw-btn_danger[_ngcontent-%COMP%]:hover{background:#F5DEB3}"]}),t})()}];let C=(()=>{class t{}return t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({providers:[],imports:[[s.Bz.forChild(_),c.e]]}),t})()}}]);