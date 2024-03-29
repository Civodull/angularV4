import { Component, OnInit, TrackByFunction } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable,Subject,combineLatest } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  //debut paramettres/variables de recherche
searchterm!:string;
startAt=new Subject();
endAt = new Subject();
startobs =this.startAt.asObservable();
endobs = this.endAt.asObservable();

  //fin

  //les messages d'erreurs
  creatUser:FormGroup;
  users:any[] = [];
  firestore: any;
  archive: Observable<any[]>;
  id: string | null;
  Loading=false;
  constructor(
    private fb:FormBuilder,
 firestore: AngularFirestore,
 private aRouter:ActivatedRoute,
 private router:Router,
    private _userService:UsersService,
    private toastr: ToastrService) {
  this.archive = firestore.collection('archive').valueChanges();
  this.creatUser = this.fb.group({
    nom:['', [Validators.required,Validators.minLength(2)]],
    prenom:['', [Validators.required,Validators.minLength(2)]],
    pseudo:['', [Validators.required,Validators.minLength(2)]],
    adresse:['', [Validators.required,Validators.maxLength(40)]],
    email:['', [Validators.required, Validators.email]],
    telephone:['', [Validators.required,Validators.maxLength(15)]],
   // password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
    role:['', Validators.required]
    
//    role:['', Validators.required]
  });
//Recuperation de l'utilisateur à modifier
this.id = this.aRouter.snapshot.paramMap.get('id');
 }

  ngOnInit(): void {
    this.getUserDoc()
 combineLatest(this.startobs, this.endobs).subscribe((value:any) => {//
   this.firequery(value[0], value[1]).subscribe((users:any) =>
   this.users=users);
   });
    //Fonction de recherche :
  }
  search($event: any){
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + "\uf8ff");
  }
  firequery(start: any,end: any):Observable<any> {
    return this.firestore.collection('users', (ref: { limit: (arg0: number) => { (): any; new(): any; orderBy: { (arg0: string): { (): any; new(): any; startAt: { (arg0: any): { (): any; new(): any; endAt: { (arg0: any): { (): any; new(): any; valueChanges: { (): any; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; })=>ref.limit(4).orderBy('nom').startAt(start).endAt(end).valueChanges())
  }
//Cette fonction interagit avec le service pour la recuperation du user
  getUserDoc(){
    this._userService.getUser().subscribe(data => {
      this.users = [];
      data.forEach((el:any) => {
      //  console.log(el.payload.doc.id);
        //console.log(el.payload.doc.data());
        this.users.push({
          id:el.payload.doc.id,
          ...el.payload.doc.data()
        })
      }); console.log(this.users);
    })
  }
  //Methode d'insersion 
  inserEdit() {
    const unUser:any={
      nom:this.creatUser.value.nom,
      prenom:this.creatUser.value.prenom,
      pseudo:this.creatUser.value.pseudo,
      adresse:this.creatUser.value.adresse,
      email:this.creatUser.value.email,
      telephone:this.creatUser.value.telephone,
      role:this.creatUser.value.role,
      datedeCreation:new Date(), 
      dateModification:new Date(),
      status:0
    }
        this.Loading = true;
        this._userService.ajouterUser(unUser).then(()=>{
        this.toastr.success('Utilisateur modifier avec succès','Excellent!',{
          positionClass:'toast-top-right',
        });
        this.Loading = true;
        this.router.navigate(['/admin'])
      }).catch(err =>{
        console.log(err);
        this.Loading = false;
      })
      }
//Suppression cote front 
deleteUser(id:string){
// if(!this.confirmClicked){
 //debut alert
 Swal.fire({
  title: 'Confirmez la suppression ?',
  text: 'Action non reversible !',
  icon: 'warning',
  showCancelButton: true,
  cancelButtonColor: '#3085d6',
  confirmButtonColor: '#d33',
  confirmButtonText: 'Supprimer!',
  cancelButtonText: 'Annuler'
}).then((result) => {
  if (result.isConfirmed) {
 //   this._userService.deleteUser(id).then(() => {
      //insertion de lutilisateur 
      const unUser:any={
        dateModification:new Date(),
        status:1
      }
      this._userService.updateUser(id, unUser).then(() => {
      //fin de l'insertion  
    this.toastr.error('Utilisateur supprimer avec succès','Vérifiez l archive!',{
     positionClass:'toast-top-right',
    });
  });
  } else if (result.dismiss === Swal.DismissReason.cancel) {
//  Swal.fire(
//   'Suppression annulée:)',
//   )
  }
})
.catch(err => {
      console.log(err)
    })
  //fin alert

  // }
}
//bar de recherche 

//recuperation de l'utilisateur supprimer
}


