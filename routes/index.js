var fetchUrl   = require("fetch").fetchUrl,
    User       = require('../models/user'),
    Vote       = require('../models/vote'),
    Feedback   = require('../models/feedback'),
    middleware = require('../middleware'),
    Message   =  require('../models/messages'),
    cryptto    = require("crypto"),
    express    = require("express"),
    middleware = require('../middleware'),
    UserPersist=require('../middleware/user-persist'),
    axios     =require('axios'),
    busboy     = require('connect-busboy'),
    upload =   require('express-fileupload'),
    fs         = require('fs'),
    multer    = require('multer'),
    csv       = require('fast-csv'),
    uniqid    = require('uniqid'),
    upload = multer({ dest: 'tmp/csv/' }),
    router     = express.Router(),
    QRCode = require('qrcode'),
     EC = require('elliptic').ec,
     ec = new EC('curve25519');
     let  user =new UserPersist();


var base_hash = "fngreurh389u4e82h8e42q0s@";


//election post
router.post("/voter/casttt/:id",  function(req, res) {
  var vote={
       'chairman':req.body.chairman,
       'chairlady':req.body.chairlady,
       'secretary':req.body.secretary,
       'academic_rep':req.body.academic_rep,
       'clubs_rep':req.body.clubs_rep,
       'entertainment_rep':req.body.entertainment_rep,
       'it_rep':req.body.it_rep,
       'sports_rep':req.body.sports_rep,
       'wellness_rep':req.body.wellness_rep,
       'treasurer':req.body.treasurer
  };
  var voter_link =req.params.id;
    const register = async () => {
        try {
            return await axios.post(`https://api-service-aeon-chain.herokuapp.com/voter/cast`, {
                
                
                    vote,
                    voter_link
                    
            });
        } catch (error) {
            // Do nothing
        }
    }
    
    const sendregister = async () => {
        const electionInfo = await register();
        const electionInfoData = electionInfo.data;
       //console.log(electionInfoData.user);
        if(electionInfoData.status != "UNVERIFIED" ){
             
    
         req.flash("success","Success");
          console.log(electionInfoData);
           
           
        } else {req.flash("error","You can't vote twice")};
    
        res.redirect("back");
    
    }
    
    sendregister();
    
    
});


//election get route
router.get("/voter/cast/:id",  function(req, res) {
    res.render("vote",{
        voteid: req.params.id
    });
});



//exchange rate route
router.get("/exchange",  function(req, res) {
    res.render("exchange");
});


//get results route
router.get("/election/results",  function(req, res) {
    const register = async () => {
        try {
            return await axios.post(`https://api-service-aeon-chain.herokuapp.com/election/results`);
        } catch (error) {
            // Do nothing
        }
    }
    
    const sendregister = async () => {
        const electionInfo = await register();
        const electionInfoData = electionInfo.data;
       
                if(electionInfoData){
            
            console.log(electionInfoData);
           
         
            res.render("results",{
                total : electionInfoData[0],
                
            });
            
        } else {req.flash("error","Password or username incorrect")};    
    }
    
    sendregister();  
});



//honor council results route 
router.get("/election/honorc",  function(req, res) {
    const register = async () => {
        try {
            return await axios.get(`https://api-service-aeon-chain.herokuapp.com/election/results/5627a1a0-f2f4-11e8-b0e2-47586cbb2047`);
        } catch (error) {
            // Do nothing
        }
    }
    const sendregister = async () => {
        const electionInfo = await register();
        const electionInfoData = electionInfo.data;
        console.log(electionInfoData);
        
                if(electionInfoData){
            
            // console.log(electionInfoData);
           var total = electionInfoData.merged_result_object.vetted_contenders[0];
           var total1 = electionInfoData.merged_result_object.vetted_contenders[1];
           var total2 = electionInfoData.merged_result_object.vetted_contenders[2];
           var total3 = electionInfoData.merged_result_object.vetted_contenders[3];
           var total4 = electionInfoData.merged_result_object.vetted_contenders[4];
           var total5 = electionInfoData.merged_result_object.vetted_contenders[5];
           var total6 = electionInfoData.merged_result_object.vetted_contenders[6];
           var total7 = electionInfoData.merged_result_object.vetted_contenders[7];
          console.log(electionInfoData.merged_result_object.vetted_contenders)
            res.render("honorresults",{
                total : total,
                total1 : total1,
                total2 : total2,
                total3 : total3,
                total4 : total4,
                total5 : total5,
                total6 : total6,
                total7 : total7
                
            });
            
        } else {req.flash("error","Password or username incorrect")};  
    }
    
    sendregister();
    
})


//HONOR COUNCIL display route
router.get("/honorc", function(req, res) {
    
    res.render("honorc");
});
//vote honor coucil route
router.post("/honorc/vote/:id/:link", function(req, res) {

       if(req.body.honorc == req.body.honorc1){
           req.flash("error", "You cant vote for the same candidate twice")
           console.log("sorry")
           res.redirect("back");
       } else if(req.body.honorc1==req.body.honorc2){
        req.flash("error", "You cant vote for the same candidate twice") 
        console.log("sorry") 
        res.redirect("back");
       } else if(req.body.honorc==req.body.honorc2){
        req.flash("error", "You cant vote for the same candidate twice")   
        console.log("sorry")
        res.redirect("back");
       }    
    var vote=[
        {'honorc':req.body.honorc},
        {'honorc':req.body.honorc1},
        {'honorc':req.body.honorc2}
        
   ];

   var voter_link =req.params.link;
   var election_id =req.params.id;

   const register = async () => {
    try {
        return await axios.post(`https://api-service-aeon-chain.herokuapp.com/voter/cast`, {
            
            
                vote,
                voter_link,
                election_id
                
        });
    } catch (error) {
        // Do nothing
    }
}

const sendregister = async () => {
    const electionInfo = await register();
    const electionInfoData = electionInfo.data;

    if(electionInfoData.status){
        req.flash("error","You can't vote twice");
        res.redirect("back");
        
        console.log("you cant vote,twice");
        console.log(election_id);
       
       
    } else {
        req.flash("success","You have voted your choice");
        res.redirect("back");
   
        console.log(electionInfoData);
       

         };
}

sendregister();      
   
});

//election link verify route
router.get("/verify/:id", function(req, res) {
   var voter_link=req.params.id;
  // console.log(voter_link);

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
  
    if(electionInfoData.status){
         
     res.redirect("back");
     req.flash("success","You are using the wrong code");
    console.log(electionInfoData)
          
    } else {
     var voter_link =electionInfoData.voter_link;
     var id =electionInfoData.id;
   

        res.render("honorc",{
           id : id,
           link :voter_link 
        });
    

};
   
}

sendregister();
  
});




//results

router.get("/results", function(req, res) {
console.log(uniqid()); // -> 4n5pxq24kpiob12og9
console.log(uniqid(), uniqid()); // -> 4n5pxq24kriob12ogd, 4n5pxq24ksiob12ogl
    res.render("results");
});


//index page route
router.get("/index",  function(req, res) {
    res.render("index");
});

//create of election route
router.get("/createelection",  function(req, res) {
   
        res.render("createelection");
   
   
});
//route to receive aeons  
router.post("/receivechain", function(req, res) {
    if (req.user.Eon > req.body.amount){
        console.log (req.body.publickey);
        console.log(req.body.amount) ;
      } else {
          console.log("You dont have enough Aeons");
          req.flash("error", "you dont have enough Aeons");
      }
   res.redirect("back");
    // res.render("esc");

});






//valid
router.get("/valid",  function(req, res) {
axios({
    method:'get',
    url:'https://min-api.cryptocompare.com/data/histominute?fsym=ADA&tsym=USD&limit=60&aggregate=3&e=CCCAGG',
   // responseType:'stream'
  })
    .then(function(response) {
  //  (response.data.pipe(fs.createWriteStream('ada_lovelace.jpg')))
    console.log(response.data);
  });

    res.render("valid");
});

//upload route
router.post('/upload', function(req,res){

    console.log(req.files);
    res.redirect("back");
  });
  

module.exports = router;