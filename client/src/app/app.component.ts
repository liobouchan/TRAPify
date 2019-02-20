import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import {User} from './models/user'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'TRAPify';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;



  constructor(
	private _userService : UserService
  ){
  	this.user = new User('', '', '', '', '', 'ROLE_USER', '');
  	this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit(){
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
  	console.log(this.identity);
  	console.log(this.token)
  }

  public onSubmit(){
  	console.log(this.user);
  	// Conseguir los datos del usuario identificado
  	this._userService.signup(this.user).subscribe(
  		response => {
  			let identity = response.user;
  			this.identity = identity;

  			if (!this.identity._id) {
  				alert("El usuario no está correctamente identificado");
  			}else{
  				//crear elemento el el localstorage para tener al usuario sesion
  				localStorage.setItem('identity' , JSON.stringify(identity));
  				//conseguir el token para enviarselño a cada peticion htttp
  				this._userService.signup(this.user , 'true').subscribe(
  					response => {
  					let token = response.token;
  					this.token = token;

  				if (this.token.length <= 0) {
  					alert("El token no se ha generado");
  				}else{
  				//crear elemento el el localstorage para tener el tokjen disponible
  					localStorage.setItem('token' ,token);
				  	this.user = new User('', '', '', '', '', 'ROLE_USER', '');
				
  				}
  			console.log(response);
  		},
  		error => {
  			var errorMessage = <any>error;
  			if (errorMessage != null) {
  				var body = JSON.parse(error._body);
  				this.errorMessage = body.message;
  				console.log(error);
  			}
  		}
  		);
  			}
  			console.log(response);
  		},
  		error => {
  			var errorMessage = <any>error;
  			if (errorMessage != null) {
  				var body = JSON.parse(error._body);
  				this.errorMessage = body.message;
  				console.log(error);
  			}
  		}
  		);
  }

  logout(){
  	localStorage.removeItem('identity');
  	localStorage.removeItem('token');
  	localStorage.clear();
  	this.identity = null;
  	this.token = null;
  }


  onSubmitRegister(){
  	console.log(this.user_register);
  	this._userService.register(this.user_register).subscribe(
  		response => {
  			let user = response.user;
  			this.user_register = user;

  			if (!user._id) {
  				this.alertRegister = 'Error al Registrarse';
  			}else{
  				this.alertRegister = "El registro se ha realizado Correctamente , identificate con " + this.user_register.email;
  				this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
  			}
  		},
  		error => {
  			var errorMessage = <any>error;

  			if (errorMessage != null) {
  				var body = JSON.parse(error._body);
  				this.alertRegister = body.message;

  				console.log(error);
  			}
  		}
  	);
  }

}
