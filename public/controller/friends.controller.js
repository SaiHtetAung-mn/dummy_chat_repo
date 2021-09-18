import * as modal from '../model/friends.model.js';
import * as Notification from '../model/noti.model.js';
const requestURL = '/userOpr/friends';

let friendSearch = document.getElementById('friends-search');
let friendsSearchWrapper = document.getElementById("friends-search-wrapper");

friendSearch.addEventListener("change", async () => {
    let searchData = friendSearch.value;
    if(searchData === '') {
        modal.setActiveTab(modal.friends_tabs[0]);
        modal.setActiveTabContent(modal.friends_tabs_contents[0]);
    }
    else {
        modal.setActiveTabContent(modal.friends_tabs_contents[2]);
        let url = `${requestURL}/search_friends`;
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'text/plain'
            },
            body: String(searchData)
        }
        try {
            let res = await (await fetch(url, options)).json();
            if(res.isError) {
                throw new Error(res.error_text);
            }
            else {
                let friends = res.friends || [];
                if(friends.length === 0) {
                    friendsSearchWrapper.innerHTML = `
                        <p class="search-no-result">No results</p>
                    `;
                }
                else {
                    modal.renderFriendsList(friends, friendsSearchWrapper);
                }
            }
        }
        catch(err) {
            Notification.openNoti("Fail to search friend! Server error");
            console.log(err);
        }
    }
})
