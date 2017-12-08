/*
Open a new tab, and load "my-page.html" into it.
*/
function handleClick() {

    console.log("injecting");

    function directGithubRaw(tabs) {
        console.log(`the typeof argument[0] is ${ typeof arguments[0]}`);
        console.log(`the argument[0] is ${arguments[0]}`);
        const originUrl = tabs[0];
        console.log(`the originUrl in directGithubRaw function is ${originUrl}, right?`);
        // console.log(`${}`);
        const trueHtmlUrl = `http://localhost:57777/${encodeURIComponent(originUrl)}`;
        // const trueHtmlUrl = `http://localhost:57777/${originUrl}`;
        console.log(`the trueHtmlUrl in directGithubRaw function is ${trueHtmlUrl}, right?`);
        browser.tabs.update(tabs[0].id, {url: trueHtmlUrl});
    }

    const gitlabTabIsAccessDatesObj = {};
    let count = 0;
    browser.browserAction.onClicked.addListener(function () {
        const queryingCurTab = browser.tabs.query({currentWindow: true, active: true});
        queryingCurTab.then((tabs) => {
            const cachedCurTabObj = tabs[0];
            const curUrl = cachedCurTabObj.url;
            const lastAccessed = cachedCurTabObj.lastAccessed;
            const id = cachedCurTabObj.id;
            // console.log(`curUrl is ${curUrl}, right?`);
            // console.log(`lastAccessed is ${lastAccessed}, right?`);
            if(gitlabTabIsAccessDatesObj[curUrl] == undefined) gitlabTabIsAccessDatesObj[curUrl] = [];
            gitlabTabIsAccessDatesObj[curUrl].push(lastAccessed);
            count++;
            // console.dir(gitlabTabIsAccessDatesObj);
            // console.log(`above is gitlabTabIsAccessDatesObj, right?`);
            // console.log(`Now, count is: ${count}, right?`);
            return {
                id,
                curUrl,
                count,
                gitlabTabIsAccessDatesAry: gitlabTabIsAccessDatesObj[curUrl]
            };
        }, (err) => {
            throw err
        })
            .then(function (tabInfoObj) {
                const {curUrl, count, id} = tabInfoObj;
                console.log(`In then block's anonymouse function scope, argument curUrl is ${curUrl}, right?`);
                if ( /^https:\/\/raw.githubusercontent.com\/.*/.test(curUrl) ) {
                    // console.log(`matched url is ${curUrl}, right?`);
                    directGithubRaw([curUrl]);
                } else if (  /^https:\/\/gitlab.com(\/[^\/]+)+\/raw\/.+\.html/.test(curUrl) ) {
                    console.log(`matched url is ${curUrl}, right?`);
                    function messageTab() {
                        // console.log(`If you can see this message, the messageTab function exectued.`);
                        const isOrigin = !!(count % 2);
                        // console.log(`this is the isOrigin: ${isOrigin}, right?`);
                        browser.tabs.sendMessage(id, {
                            isOrigin
                        });
                    }
                    messageTab();
                }
            });
    });
}

browser.browserAction.onClicked.addListener(handleClick);
 
