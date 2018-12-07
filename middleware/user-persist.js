// class UserPersist {
//     constructor() {

//         this.user = [];
//     }

//     addUser(userData) {
        
//         this.user = userData;
//     }

//     retrieveUser() {

//         return this.user;
//     }

//     removeUser() {

//         this.user = null;
//     }
//     isUser(){
//         if(this.user == null) {
//             return false;
//         }
//         else {
//             return true;
//         }
//     }
// }

// module.exports = UserPersist;





class UserPersist {
    constructor() {

        this.user = [];
    }
   
    addUser(userdata) {
        var isadded=false;

        for (var i=0;i< this.user.length; i++) {
            if (this.user[i]==userdata){
                isadded=true;
            }
        } 
        if (!isadded){
            this.user.push(userdata);
        }
       
    }

    retrieveUser(publicKey) {

        for (var i=0;i< this.user.length; i++) {
            if (this.user[i].wallet.publicKey==publicKey){
                
                return this.user[i];
            }
        } 
        return false;
    }

    removeUser(userData) {
   
       var newUsers= this.user.filter(function (user) {
            return user !=userdata;
            
        });
        this.user=newUsers;
    }
    isUser(userdata){
        for (var i=0;i< this.user.length; i++) {
            if (this.user[i]==userdata){
                
                return true;
            }
        } 
        return false;
    }
    findUser(){
        console.log(isUser);
    }
}

module.exports = UserPersist;



// class UserPersist {
//     constructor() {

//         this.user = [];
//     }

//     addUser(userData) {
        
//         this.user = userData;
//     }

//     retrieveUser() {

//         return this.user;
//     }

//     removeUser() {

//         this.user = null;
//     }
//     isUser(){
//         if(this.user == null) {
//             return false;
//         }
//         else {
//             return true;
//         }
//     }
// }

// module.exports = UserPersist;
