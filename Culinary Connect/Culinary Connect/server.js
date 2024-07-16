const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require('dotenv');
const crypto = require('crypto');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");



const randomName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

dotenv.config();

const buckName = process.env.BUCKET_NAME;
const buckRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const scretKey = process.env.SECRET_ACCESS;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: scretKey,
    },
    region: buckRegion
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '7845cadet.',
        database: 'loginformytvideo'
    }
})

const app = express();

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));



app.get('/', (req, res) => {
    
    res.sendFile(path.join(intialPath, "index.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(intialPath, "register.html"));
})

app.get('/tg/index', async (req, res) => {
    res.sendFile(path.join(intialPath, "/tg/index.html"));

    try {
        const data = await db.select('randomname').from('donations');

        for (const item of data) {
            const requiredData = item.randomname;
            const getObjectParams = { Bucket: buckName, Key: requiredData };
            const command = new GetObjectCommand(getObjectParams);

            const url = await getSignedUrl(s3, command, { expiresIn: 18000 });

            await db('donations').where({ randomname: item.randomname }).update({ imageurl: url });
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle the error appropriately
    }
});

app.get("/tg/getallimages", (req, res) => {

    db.select('imageurl','description','title','area')
        .from('donations')
        .then(data => {
            return res.json(data);
        }) 

})

app.get('/getthenudonations',(req,res) => {
    db.select("randomname")
        .from("donations")
        .then(data => {
            var donationsTotal = 0;
            for (const item of data){
                donationsTotal += 1;
            }
            return res.json(donationsTotal);
        })


    
})

app.post('/update-email', (req, res) => {
    const { currentEmail, newEmail } = req.body;
    console.log(currentEmail, newEmail);

    db('users')
        .where({ email: currentEmail })
        .update({ email: newEmail })
        .then(() => {
            // Update successful
            res.json({ message: 'Email updated successfully' });
        })
        .catch(error => {
            // Update failed
            console.error('Error updating email:', error);
            res.status(500).json({ error: 'An error occurred while updating the email' });
        });
});

app.post('/update-name',(req,res) => {
    const {currentName , newName} = req.body;
    console.log(currentName,newName);
    db('users')
        .where({ name: currentName })
        .update({ name: newName })
        .then(() => {
            // Update successful
            res.json({ message: 'Name updated successfully' });
        })
        .catch(error => {
            // Update failed
            console.error('Error updating Name:', error);
            res.status(500).json({ error: 'An error occurred while updating the Name' });
        });


});

app.post('/update-password',(req,res) => {
    const {currentPassword , newPassword} = req.body;
    console.log(currentPassword,newPassword);
    db('users')
        .where({ password: currentPassword })
        .update({ password: newPassword })
        .then(() => {
            // Update successful
            res.json({ message: 'Password updated successfully' });
        })
        .catch(error => {
            // Update failed
            console.error('Error updating Password:', error);
            res.status(500).json({ error: 'An error occurred while updating the Password' });
        });


});

app.post('/getting-user-donations',(req,res) => {
    const {email} = req.body;
    console.log(email);

    db('users')
        .where({
            email : email
        })
        .select('numberdonation')
        .then(data =>{
            console.log(data[0]);
            return res.json(data[0]);
        })

});

app.post('/register-user', (req, res) => {
    const { name, email, password} = req.body;

    if (!name.length || !email.length || !password.length) {
        res.json('fill all the fields');
    } else {
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
            .returning(["name", "email"])
            .then(data => {
                res.json(data[0])
            })
            .catch(err => {
                if (err.detail.includes('already exists')) {
                    res.json('email already exists');
                }
            })
    }

})




app.post('/tg/index-user', upload.single('image'), (req, res) => {

    const randomImageName = randomName();
    console.log(req.body);
    const { title, description, location, persoanlName , persoanlEmail } = req.body;
    const imageBuffer = req.file.buffer;
    const params = {
        Bucket: buckName,
        Key: randomImageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,

    }

    const commad = new PutObjectCommand(params);
    s3.send(commad)

    db("donations").insert({
        description: description,
        title: title,
        area: location,
        randomname: randomImageName
    })
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.error(err);
            res.json('Error uploading donation');
        });

        // getting number of donations of the users done
        db('users')
        .where('email', '=', persoanlEmail)
        .increment('numberdonation', 1)
        .then(() => {
            console.log('numberdonation incremented successfully');
        })
        .catch((err) => {
            console.error('Error incrementing numberdonation:', err);
        });
    res.send({})
});







app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
        .from('users')
        .where({
            email: email,
            password: password
        })
        .then(data => {
            if (data.length) {
                res.json(data[0]);
            } else {
                res.json('email or password is incorrect');
            }
        })
})







app.listen(5500, (req, res) => {
    console.log('listening on port 5500......')
})
