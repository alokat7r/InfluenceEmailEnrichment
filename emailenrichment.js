const fetch = require('fetch').fetchUrl;
const gravatar = require('gravatar');



/**
 * Function to take emailID and return email enrichment as promise
 */

const gmailRegExp = /^[\w.]+@{1}gmail.com$/g;

const FetchEmailEnrichmentFunction = (emailId) => {
    return new Promise((resolve, reject) => {
        if (gmailRegExp.test(emailId.trim())) {
            // Its Gmail ID so we will go for picasaweb to get email enrichment data.
            let URI = "http://picasaweb.google.com/data/entry/api/user/" + emailId.trim() + "?alt=json";
            fetch(URI, (error, meta, body) => {
                if (!error) {
                    try {
                        let emailEnrichmentJSON = JSON.parse(body.toString());
                        let returnJson = {
                            username: emailEnrichmentJSON.entry.gphoto$nickname.$t,
                            profile_pic: emailEnrichmentJSON.entry.gphoto$thumbnail.$t
                        };
                        resolve(returnJson);
                    } catch (error1) {
                        reject(error1);
                    }
                } else {
                    reject(error);
                }
            });
        } else {
            //This is not a gmail id so we will go for Gravatar.com to email enrichment data.
            let URI = gravatar.profile_url(emailId, { protocol: 'https' });
            console.log(URI);
            fetch(URI, (error, meta, body) => {
                if (!error) {
                    try {
                        let emailEnrichmentJSON = JSON.parse(body.toString());
                        let entry = emailEnrichmentJSON.entry[0];
                        let profile_pic = entry.photos[0].value;
                        let username = entry.displayName;
                        let returnJson = {
                            username: username,
                            profile_pic: profile_pic
                        };
                        resolve(returnJson);
                    } catch (error1) {
                        reject(error1);
                    }

                } else {
                    reject(error);
                }
            });
        }
    });
};

module.exports = { FetchEmailEnrichmentFunction };