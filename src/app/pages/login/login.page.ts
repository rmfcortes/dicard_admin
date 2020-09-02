import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  formSignUp: FormGroup;
  validation_messages
  validation_signUp_messages
  err: string

  create = false

  persistent = true

  newUser = {
    name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm: ''
  }

  constructor(
    private router: Router,
    private menu: MenuController,
    private alertService: AlertService,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.menu.enable(false)
    this.setForm()
  }

  setForm() {
    this.form = new FormGroup({
      'email': new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      'isPersistent': new FormControl(true)
    },
    { updateOn: 'blur'})

    this.validation_messages = {
      'email': [
          { type: 'required', message: 'LOGIN.email_req' },
          { type: 'pattern', message: 'LOGIN.email_pattern' },
        ],
        'password': [
          { type: 'required', message: 'LOGIN.password_required' },
          { type: 'minlength', message: 'LOGIN.password_min' },
        ],
      }
  }

  async signIn() {
    this.form.controls.email.markAsTouched()
    this.form.controls.password.markAsTouched()
    if (!this.form.valid) return
    await this.alertService.presentLoading()
    this.err = ''
    this.authService.signInWithEmail(this.form.value)
    .then(() => {
      this.alertService.dismissLoading()
      this.router.navigate(['home'])
    })
    .catch((err) => {
      this.alertService.dismissLoading()
      this.err = err
    })
  }

  setSignUpForm() {
    this.create = true
    this.formSignUp = new FormGroup({
      'isPersistent': new FormControl(true),
      'name': new FormControl('', Validators.required),
      'last_name': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      'email': new FormControl('',
        Validators.compose([
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
        this.userService.checkEmailNotTaken.bind(this.userService)
      ),
      'phone': new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(10)])),
      'password2': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
    },
    { validators: this.password.bind(this),
      updateOn: 'blur'})

    this.validation_signUp_messages = {
      'name': [
        { type: 'required', message: 'LOGIN.required' },
      ],
      'last_name': [
        { type: 'required', message: 'LOGIN.required' },
      ],
      'phone': [
        { type: 'required', message: 'LOGIN.required' },
        { type: 'maxlength', message: 'LOGIN.phone_length' },
        { type: 'minlength', message: 'LOGIN.phone_length' },
        { type: 'pattern', message: 'LOGIN.phone_pattern' },
      ],
      'email': [
          { type: 'required', message: 'LOGIN.email_req' },
          { type: 'pattern', message: 'LOGIN.email_pattern' },
          { type: 'emailTaken', message: 'LOGIN.sign_up_email_taken'}
        ],
        'password': [
          { type: 'required', message: 'LOGIN.password_required' },
          { type: 'minlength', message: 'LOGIN.password_min' },
        ],
        'password2': [
          { type: 'required', message: 'LOGIN.required' },
          { type: 'minlength', message: 'LOGIN.password_min' },
          { type: 'passwordNotMatch', message: 'LOGIN.passwordNotMatch' },
        ],
      }
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: password2 } = formGroup.get('password2');
    return password === password2 ? null : { passwordNotMatch: true };
  }


  async signUp() {
    this.err = ''
    this.formSignUp.controls.name.markAsTouched()
    this.formSignUp.controls.email.markAsTouched()
    this.formSignUp.controls.phone.markAsTouched()
    this.formSignUp.controls.password.markAsTouched()
    this.formSignUp.controls.password2.markAsTouched()
    this.formSignUp.controls.last_name.markAsTouched()
    if (!this.formSignUp.valid) return
    await this.alertService.presentLoading()
    console.log(this.formSignUp.value);
    this.authService.createUserWithEmailAndPassword(this.formSignUp.value)
    .then(() => {
      this.alertService.dismissLoading()
      this.router.navigate(['home'])
    })
    .catch((err) => {
      this.alertService.dismissLoading()
      this.err = err
    })
  }

  resetPassword() {
    this.err = ''
    this.form.controls.email.markAsTouched()
    if (!this.form.controls.email.valid) return
    this.authService.resetPassword(this.form.value.email)
    .then(() =>  this.err = 'LOGIN.email_send')
    .catch(err => this.err = err)
  }

}
