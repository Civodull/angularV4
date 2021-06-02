import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css']
})
export class EtudiantComponent implements OnInit {
  users:any[] = [];
  message!: string;
  al!: boolean;
  constructor(  private _userService: UsersService,
    private router:Router,) { }

  ngOnInit(): void {
  }

  async signIn(email: string,password: string){
    this
     try{
     // await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res => {
     //   this.isLoggedIn =true;
     //   localStorage.setItem('user',JSON.stringify(res.user));
   //Debut redirections
     this._userService.getUser().subscribe(data => {
         this.users = [];
         data.forEach((el:any) => {
           this.users.push({
             id:el.payload.doc.id,
             ...el.payload.doc.data()
           })//,console.log("le role :"+el.payload.doc.role);
         });
          this.users.forEach(donnees => {
           if(email==donnees.email && password==donnees.password){
             switch(donnees.role){
               case 'Admin':
                 this.router.navigate(['/admin']);
                 break;
               case 'Etudiant':
                 this.router.navigate(['/etudiant']);
                 break;
               case 'Finance':
                 this.router.navigate(['/finance']);
                 break;
               case 'Formateur':
                 this.router.navigate(['/formateur']);
                 break;
             }
           }
           // if(email=='' || password=='' ){
           //   this.al=true;
           //   this.message='Cet utilisateur nexiste pas créez-le svp'
           // }
           if(email!=donnees.email && password==donnees.password){
             this.al=true;
             this.message='Veuillez renseigner une adresse mail valide'
           }if(email==donnees.email && password!=donnees.password){
             this.al=true;
             this.message='Veuillez renseigner un mot de passe correcte!';        
           }
           
          });
   })
  
}catch(err){
  console.log(err);
}
}
}
