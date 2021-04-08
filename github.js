const axios = require('axios');
const { createAppAuth } = require('@octokit/auth-app');
const fs = require('fs');

const pem = fs.readFileSync('./key.pem', 'utf8');

exports.getInstallationId = async (req, res) => {
    console.log('Github post', req.body);

    if(req.body != null && req.body.ref === 'refs/heads/master'){
        const installationId = req.body.installation.id;
        const data = await this.getPackage(req.body.repository.full_name, installationId);
        console.log(installationId, data);
    }
}

exports.getPackage = async(repo, installationId) => {
    const pkg = await this.githubRequest(`/repos/${repo}/contents/package.json`, installationId)
    .then(res => res.content)
    .then(content => Buffer.from(content, 'base64').toString('utf8'));
    console.log('package.json', pkg);
}

exports.createJWT = async(installationId) => {
    const auth = createAppAuth({
        id: 109310,
        privateKey: pem,
        installationId,
        clientId: "Iv1.027ab6389695b190",
        clientSecret: "d25b5b097ab714ef8901012a870159cc98e8ff7f"
    });

    const { token } = await auth({type: 'installation'});
    return token;
}

exports.githubRequest = async(url, installationId) => {
    const token = await this.createJWT(installationId);

    const res = await axios.get(`https://api.github.com${url}`, {
        headers: {
            authorization: `bearer ${token}`,
            accept: 'application/vnd.github.machine-man-preview+json'
        }
    });

    return res.data;
}

// console.log(pem);