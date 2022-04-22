const express = require('express')
const cors = require('cors')
const passwordHash = require('password-hash')
const {connectToDb} = require('./services')
const userModel = require("./models/user")
const customerModel = require('./models/customer')
const jwt = require("jsonwebtoken")
const { default: mongoose } = require('mongoose')
const invoiceModel = require('./models/invoice')
const paymentModel = require('./models/payment')
const dotenv = require("dotenv")

dotenv.config({path:"./config.env"})

const app  = express()
app.use(express.json())
app.use(cors())

const logger = (req,res,next)=>{
    console.log(req.method + " request on "+ req.url+ " ")
    next()
}

app.use(logger)
connectToDb()


app.post('/api/signup', async (req,res)=>{
    const {fname,lname,email,password,cname,gstin,address} = req.body
    if(Object.keys(req.body).length < 4){
        return res.status(400).send({error:"Bad request"});
    }
    const emailExist = await userModel.findOne({ email: email });
    if (emailExist) {
        return res.status(422).json({error:"user already exist"});
    }

    const hashedPassword = passwordHash.generate(password);
    console.log(hashedPassword)
    const saveUser = await new userModel({
        fname,
        lname,
        email,
        password: hashedPassword,
        cname,
        gstin,
        address,
    })

    await saveUser.save((err, Person) => {
        if (err) {
            console.log(err)
          return res.status(400).send(err);
        } else {
          return res.status(200).json({message:"success"});
        }
    });
})

app.post("/api/signin", async (req, res) => {
    let {email, password} = req.body
    let findUser = await userModel.findOne({ email: email });

    if (!findUser) {
      return res.status(401).json({error:"Email Not Found"});
    }

    const validPassword = passwordHash.verify(password,findUser.password)
    if (!validPassword) {
      return res.status(401).json({error:"Email or password are wrong!"});
    }

    const token = jwt.sign({ _id: findUser._id }, process.env.SECRET_KEY);
    res
      .header("auth-token", token)
      .status(200)
      .send({ token: token,
        userDetail:
        {
            fname:findUser.fname,
            lname:findUser.lname,
            address: findUser.address,
            cname: findUser.cname,
            email: findUser.email,
            gstin: findUser.gstin,
        } });
  });


app.get('/api/user',async (req, res)=>{
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded
        // Fetch the user by id
        await userModel.findOne({_id})
        .select({"password":0})
        .then((user)=>{
            // Do something with the user
            return res.json(user);
        });
    }else{
        return res.sendStatus(403);
    }
})

app.put('/api/user/',async (req, res)=>{
    console.log("called")
    const {fname,lname,cname,gstin,address} = req.body
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded
        // Fetch the user by id

        const saveUser ={
            fname,
            lname,
            cname,
            gstin,
            address,
        }

        let result =  await userModel.findByIdAndUpdate(
            _id,
            saveUser,
            {new:true}
          ).catch(e=>{
              res.json({msg:"error", e})
          })

          if(result){
              console.log(result)
              res.json({result, success: true, msg: 'User details updated'})
          }

    }else{
        return res.sendStatus(403);
    }
})


app.post('/api/customers/add', async (req, res)=>{

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            console.log(e)
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded
        // Fetch the user by id
        const {cname,email,phone,address} = req.body

        const saveCustomer = await new customerModel({
            cname,
            email,
            phone,
            address,
            sellerid:_id
        })

        await saveCustomer.save(async (err) => {
            if (err) {
                console.log(err)
                return res.status(400).send(err);
            } else {
                await customerModel.find({sellerid:_id})
                .then((customers)=>{
                    return res.json(customers);
                });
            }
        });
    }else{
        return res.sendStatus(403);
    }
})

app.put('/api/customer/',async (req, res)=>{
    const {cnameinput,cemailinput,cphoneinput,caddressinput,cid} = req.body
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded
        // Fetch the user by id

        const saveCustomer ={
            cname:cnameinput,email:cemailinput,phone:cphoneinput,address:caddressinput
        }

        let result =  await customerModel.findByIdAndUpdate(
            cid,
            saveCustomer,
            {new:true}
          ).catch(e=>{
              res.json({msg:"error", e})
          })

          if(result){
              await customerModel.find({sellerid:_id})
            .then((customers)=>{
                return res.json(customers);
            });
          }

    }else{
        return res.sendStatus(403);
    }
})

app.get('/api/customers', async(req, res)=>{
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            console.log(e)
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded
        await customerModel.find({sellerid:_id})
        .then((customers)=>{
            return res.json(customers);
        });
    }else{
        return res.sendStatus(403);
    }
})

app.put('/api/customer/:id', async(req, res) => {
    const {id: _id} = req.params
    const {cname,email,phone,address,sellerid} = req.body
    if(Object.keys(req.body).length < 5){
        return res.status(400).send({error:"Bad request"});
    }

    const saveCustomer = {
        cname,
        email,
        phone,
        address,
        sellerid:mongoose.Types.ObjectId(sellerid)
    }

    let result =  await customerModel.findByIdAndUpdate(
      _id,
      saveCustomer,
      {new:true}
    ).catch(e=>{
        res.json({msg:"error", e})
    })

    if(result){
        console.log(result)
        res.json({result, success: true, msg: 'Customer details updated'})
    }
  })

app.get('/api/invoice/getnumber',async(req,res)=>{
    if (req.headers && req.headers.authorization) {
        // let {invoiceno,date,customerid,sellerid,items,note,totalAmount,status} = req.body
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            console.log(e)
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded

        console.log(_id)
        data = await invoiceModel.find({sellerid:_id}).sort({invoiceno:-1}).limit(1)
        return res.json({invoiceno:data[0]?data[0].invoiceno+1:1})
    }
})

app.post('/api/invoice/add/',async (req,res)=>{
    if (req.headers && req.headers.authorization) {
        let {invoiceno,date,customerid,sellerid,items,note,totalAmount,status} = req.body
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            console.log(e)
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded

        let saveInvoice = await new invoiceModel({
            invoiceno,
            date:Date.now(),
            customerid,
            sellerid:_id,
            items,
            note,
            totalAmount,
            status
        })

        await saveInvoice.save((err, Person) => {
            if (err) {
                console.log(err)
              return res.status(400).send(err);
            } else {
              return res.status(200).json({message:"success",Person});
            }
        })
    }
})

app.put('/api/invoice',async (req,res)=>{
    console.log(req.body)
    if (req.headers && req.headers.authorization) {
        let {invoiceId,date,customerid,sellerid,items,note,totalAmount,status} = req.body
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            console.log(e)
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded

        let saveInvoice = {
            items,
            note,
            totalAmount,
            status
        }

        let result =  await invoiceModel.findByIdAndUpdate(
            invoiceId,
            saveInvoice,
            {new:true}
        ).catch(e=>{
            res.json({msg:"error", e})
        })

        if(result){
            console.log(result)
            res.json({result, success: true, msg: 'Invoice Updated.'})
        }
    }
})

app.get('/api/invoice/all/',async(req,res)=>{
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            console.log(e)
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded

        await invoiceModel.find({sellerid:_id})
        .then((invoices)=>{
            return res.json(invoices);
        });
    }else{
        return res.sendStatus(403);
    }
})


app.get('/api/invoice/:id',async(req,res)=>{
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            console.log(e)
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded
        let id = req.params.id

        await invoiceModel.findById(id)
        .then((invoices)=>{
            return res.json(invoices);
        });
    }else{
        return res.sendStatus(403);
    }
})


app.delete('/api/invoice/delete/:id',(req,res)=>{
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            console.log(e)
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded

        invoiceModel.findByIdAndDelete(req.params.id).then(async (result)=>{
            console.log(result)
            await invoiceModel.find({sellerid:_id})
            .then((invoices)=>{
                return res.json(invoices);
            });
        })
    }
})

app.post('/api/payment/add',async(req, res)=>{
    if(req.headers && req.headers.authorization){
        let {customerid,sellerid,method,amount} = req.body
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            console.log(e)
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded

        let savePayment= new paymentModel({
            date: new Date(),
            customerid,
            sellerid: _id,
            amount,
            method
        })

        await savePayment.save((err,result)=>{
            if (err) {
                console.log(err)
              return res.status(400).send(err);
            } else {
              return res.status(200).json({message:"success",result});
            }
        })
    }
})

app.get('/api/dashboard',async(req,res)=>{
    let data= [{
        "name":"Total Customer",
        "value":"0",
    },
    {
        "name":"Total Invoice",
        "value":"0",
    },
    {
        "name":"Total Amount",
        "value":"0",
    },
    ]

    if(req.headers && req.headers.authorization){
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, "Jenish-Dhanani");
        } catch (e) {
            console.log(e)
            return res.status(401).send('unauthorized');
        }
        let {_id} = decoded

        let customers = await customerModel.find({sellerid:_id})
        data[0].value = customers.length

        let invoices = await invoiceModel.find({sellerid:_id})
        console.log(invoices)

        data[1].value = invoices.length

        let sum = 0
        invoices.forEach(element => {
            sum += element.totalAmount
        });
        data[2].value = sum

        return res.send(data)
    }
})

const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"))
    const path = require("path");
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log(`server run sucessfully ${process.env.PORT || 5000}👍`);
})

