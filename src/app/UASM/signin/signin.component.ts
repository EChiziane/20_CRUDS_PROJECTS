import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  signinForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signinForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
      role: ['USER', Validators.required] // Valor padrão USER
    });
  }

  submitForm(): void {
    if (this.signinForm.valid) {
      const user = this.signinForm.value;
      console.log('Enviando dados:', user);

      this.authService.signup(user).subscribe({
        next: (response) => {
          console.log('Usuário registrado com sucesso!', response);
          alert('Registro bem-sucedido!');
        },
        error: (err) => {
          console.error('Erro ao registrar usuário:', err);
          alert('Falha ao registrar usuário!');
        }
      });
    } else {
      console.log('Formulário inválido!');
    }
  }
}
