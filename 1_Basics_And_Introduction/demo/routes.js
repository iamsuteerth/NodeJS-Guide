const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Greetings</title></head>');
        res.write('<body><h1> Hello from Node JS </h1> <form action = "/create-user" method="POST"><input type = "text" name="username"><button type = "Submit"> Send </button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if(url === '/create-user' && method === 'POST'){
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log(message);
            return res.end();
        });
    }
    if(url === '/users' && method === 'GET'){
        res.write('<html>');
        res.write('<head><title>User List</title></head>');
        res.write('<body><ul><li>User 1</li><li>User 2</li></ul></body>');
        res.write('</html>');
        return res.end();
    }
    res.setHeader('Content-Type', 'text/html');
    res.end();
};
module.exports = requestHandler;