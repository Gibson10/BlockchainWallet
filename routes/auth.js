var User       = require('../models/user'),
    nodemailer = require('nodemailer'),
    passport   = require('passport'),
    Papa       =require('papaparse'),
    axios     =require('axios'),
    fs         = require('fs'),
    express    = require("express"),
    csv            =require("csv-to-array"),
    multer    = require('multer'),
    uniqid    = require('uniqid'),
    csv       = require("fast-csv"),
    upload = multer({ dest: 'tmp/csv/' }),
    middleware = require('../middleware'),
    UserPersist=require('../middleware/user-persist'),
    papa = require('papaparse'),
    router     = express.Router();
    let  user =new UserPersist();


//register post route

router.post('/register', (req, res) => {

    const {
        email,
        username,
        password
    } = req.body;

    const register = async () => {
        try {
            return await axios.post(`https://api-service-aeon-chain.herokuapp.com/register`, {
            email,
            username,
            password
            });
        } catch (error) {
            // Do nothing
        }
    }
    const sendregister = async () => {
        const electionInfo = await register();
        const electionInfoData = electionInfo.data;
        console.log(electionInfoData);
       
        res.redirect('/');
        req.flash("success","Congratulations on registering,an email has been sent to you")
    }

    sendregister();
});
  
//post route to receivecoin from chain
router.post("/sendcsv", upload.any(), function(req, res) {

    if (user.isUser() ) {
        var userdata=user.retrieveUser();
        var walletInstance =userdata.wallet;
       //console.log('gerry', userdata.wallet);
        console.log('gerry', walletInstance);
         var election_name=req.body.name;
         var seed_amount=req.body.amount;
         var start_time =req.body.start;
         var end_time  = req.body.end;

         var timeStampStart = new Date(start_time.replace(/-/g, '/')).getTime();
         var timeStampEnd = new Date(end_time.replace(/-/g, '/')).getTime();

        //  var timeStamp = end_time.getTime();

         console.log('martin',election_name);
         console.log('kibiru',seed_amount);
         console.log('kiinga',timeStampStart);
         console.log('kioi',timeStampEnd);
    
     
        /* Validate an electorate csv file */

        // Variable to store electorate emails
        let electorateEmails = [];

        // Read the electorate csv file

        const electorateData = fs.readFileSync('/Users/gibson/blockchain2/routes/electorate1.csv', 'utf8');
        const electoratedata = Papa.parse(electorateData, {
            skipEmptyLines: true,
        });
        const electorate =electoratedata.data;
        console.log('mwangi',electorate);
        
        let contenderEmails = [];

        // Read the contenders csv file
//   /Users/gibson/blockchain2/contenders.csv
        const contendersData = fs.readFileSync('/Users/gibson/blockchain2/contenders.csv', 'utf8');
        const contendersdata = Papa.parse(contendersData, {
            skipEmptyLines: true,

        });
       const contenders =contendersdata.data;
        console.log('marto',contenders);

        // var electorateCSVData = [];
        // var contendersCSVData = [];
        // req.files.forEach(function(fileData, i) {
        //     const fileRows = [];
        //     csv.fromPath(fileData.path)
        //     .on("data", function (data) {
        //     fileRows.push(data); 
        //     if(i == 0) {
        //         electorateCSVData.push(data);
        //         console.log(electorateCSVData);
        //     } else {
        //         contendersCSVData.push(data);
        //         console.log(contendersCSVData);
        //     }
        //     })
        //     .on("end", function () {
        //         fs.unlinkSync(fileData.path);
        //       })
           // });

   
const register = async () => {
    try {
        return await axios.post(`https://api-service-aeon-chain.herokuapp.com/create-election`, {
            
            
            contenders,
            electorate,
            election_name,
            seed_amount,
            timeStampStart,
            timeStampEnd,
            walletInstance,
            
                
        });
    } catch (error) {
        // Do nothing
    }
}

const sendregister = async () => {
    const electionInfo = await register();
    const electionInfoData = electionInfo.data;
  
    if(electionInfoData.status != "UNVERIFIED" ){
        
      console.log(electionInfoData);
       
        res.redirect("back");
        

    } else {req.flash("error","Password or username incorrect")
    console.log(electionInfoData.message);

};    
}

sendregister();

     }

});


// route to auntheticate link from chain
router.get("/voter/verify/:id", function(req, res) {

   var voter_link = req.params.id;
    const register = async () => {
        try {
            return await axios.post(`https://api-service-aeon-chain.herokuapp.com/voter/verify`, {
                
                
                voter_link,
               
                    
            });
        } catch (error) {
            // Do nothing
        }
    }
    
    const sendregister = async () => {
        const electionInfo = await register();
        const electionInfoData = electionInfo.data;
        console.log(electionInfoData);
        if(electionInfoData.status != "UNVERIFIED" ){
             user.addUser(electionInfoData);

           var id =electionInfoData.id;
           
             
            res.json(electionInfoData);
            
        
    
        } else {req.flash("error","Password or username incorrect")};
    
        
    }
    
    sendregister();
    
    res.json({"i":"i"});
    

});


// Account Confirmation Route
router.get("/user/confirm/:id/:randomUid", function(req, res) {
    User.findById(req.params.id, function(err,  user) {
       if(err) {
           console.log(err);
           req.flash("error", "An error has occurred");
           res.redirect("/");
       } else {
           if(req.params.randomUid == user.randomUid) {
               user.hasConfirmed = "true";
               user.save();
               console.log(user);
               
               req.flash("success", "You have been successfuly registered");
               res.redirect("/");
           } else {
               req.flash("error", "Your activation link has an error");
               res.redirect("/");
           }
       }
    });
});


// Auth form route
router.get("/", function(req, res) {
   res.render("login");
});

// Login post route
router.post('/login', function(req, res, next) {

   var password =req.body.password;
   var username =req.body.username;
   

const register = async () => {
    try {
        return await axios.post(`https://api-service-aeon-chain.herokuapp.com/login`, {
            
            
                username,
                password
                
        });
    } catch (error) {
        // Do nothing
    }
}

const sendregister = async () => {
    const electionInfo = await register();
    const electionInfoData = electionInfo.data;

    if(electionInfoData.status != "UNVERIFIED" ){
        console.log(electionInfoData.wallet.publicKey);
         user.addUser(electionInfoData.user);
         user.isUser(electionInfoData.user);
         
         console.log(user.isUser(electionInfoData));
       console.log(electionInfoData.wallet.publicKey);
        
        res.redirect("/home/" + electionInfoData.wallet.publicKey);
        
        

    } else {req.flash("error","Password or username incorrect")

   // console.log(user.findUser());
    console.log("not found");
      res.redirect("/");
};   
}

sendregister();

});

// home route 
router.get("/home/:id",  function(req, res) {
  // console.log(user.isUser());  
  const pk = req.params.id; 
  var userdata=user.retrieveUser(pk);  
 if (user.isUser(userdata) ) {
     //console.log(userdata);

     var string =userdata.username.substring(0,userdata.username.indexOf("@"));
     var key =userdata.wallet.publicKey;
     console.log(key);
     res.render("home",{
         user:key,
         email :string,
         balance :"40"
     });
 } else {

    res.redirect("/");
 }
   

//contact route
router.get("/vote",  function(req, res) {
      
res.render("vote");    
});
});

//send coins to someone route
router.post("/sendchain",  function(req, res) {
   
    var recipientpublickey=req.body.otherpublickey;
    var amountAsString = req.body.amount;
    var amount = parseInt(amountAsString);
 
    if (user.isUser() ) {
        var userdata=user.retrieveUser();
        var walletInstance =userdata.wallet;
        var wallet =userdata.wallet;
    }

    const register = async () => {
        try {
            return await axios.post(`https://api-service-aeon-chain.herokuapp.com/transact`, {
                
                
                recipient,
                amount,
                walletInstance

                    
            });
        } catch (error) {
            // Do nothing
        }
    }
    
    const sendregister = async () => {
        const electionInfo = await register();
        const electionInfoData = electionInfo.data;
       //console.log(electionInfoData.user);
       console.log(electionInfoData.status);
        if(electionInfoData.status != "UNVERIFIED" ){
        req.flash("error","Your transaction was successful")
          
        } else {req.flash("error","You dont have enough coins")};
     
    }
    
    sendregister();
    res.redirect("back");
     
 });


//transaction route
router.get("/transactions/:id",  function(req, res) {
    const pk = req.params.id; 
    var userdata=user.retrieveUser(pk);      

    if (user.isUser(userdata) ) {
        // var userdata=user.retrieveUser();
        var string =userdata.username.substring(0,userdata.username.indexOf("@"));
        var walletInstance =userdata.wallet;
        console.log(walletInstance);
        
    

    const register = async () => {
        try {
            return await axios.post(`https://api-service-aeon-chain.herokuapp.com/balance`, {
                walletInstance,       
            });
        } catch (error) {
        }
    }
    const sendregister = async () => {
        const electionInfo = await register();
        const electionInfoData = electionInfo.data;
       
       
           console.log (electionInfoData); 
            
            var balance =electionInfoData.balance;
            console.log(walletInstance.publicKey);
            console.log(walletInstance.balance);
            
    
        
        res.render("transactions",{
            user:userdata.wallet.publicKey,
            email :string,
            balance:balance
        
        });
    }
        sendregister();
}
else {
    res.redirect("/");
}
});


//update route
router.post('/update', function(req,res){

    
  var name=req.body.name;
  var email=req.body.username;
  var password=req.body.password;

  const register = async () => {
    try {
        return await axios.post(`https://api-service-aeon-chain.herokuapp.com/voter/user/update`, {
            
            
            name,
            email,
            password
           
                
        });
    } catch (error) {
        // Do nothing
    }
}

const sendregister = async () => {
    const electionInfo = await register();
    const electionInfoData = electionInfo.data;
    console.log(electionInfoData);
    if(electionInfoData.status != "UNVERIFIED" ){
         user.addUser(electionInfoData);

         
        res.json(electionInfoData);
        
    

    } else {req.flash("error","Password or username incorrect")};

    
}

sendregister();  






    res.redirect("back");
  });

//update get route
  router.get("/update/:id", function(req, res) {
    const pk = req.params.id; 
    var userdata=user.retrieveUser(pk); 
    if (user.isUser(userdata) ) {
        //var userdata=user.retrieveUser();
        var key=userdata.wallet.publicKey;
        var name1=userdata.username;
        var password =userdata.username;
        var string =userdata.username.substring(0,userdata.username.indexOf("@"));
        console.log(key);
        console.log(name1);
        console.log(password);

        res.render("update",{
            user:userdata.wallet.publicKey,
            name : string,
            name1 : name1,
            password :password,
            
            
        });

    } 
    else 
    {
    
    res.redirect("/");
    };
   
    
});

//logout route
router.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/");
});



//contacts page  route
router.get("/contact/:id",  function(req, res) {
  
    const pk = req.params.id; 
    var userdata=user.retrieveUser(pk); 
 if (user.isUser(userdata) ) {
     console.log(userdata.wallet.publicKey);
    res.render("contact",{
        user:userdata.wallet.publicKey,
    });
    } else {
        res.redirect("/");   
    }
});


//Function to create random user id
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = router;

