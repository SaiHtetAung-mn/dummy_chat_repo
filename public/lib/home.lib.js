import * as Notification from './noti.lib.js';
const CLASS_ACTIVE_MENU = "active-menu";
let menuTabs = document.getElementsByClassName("menu-icon");
let activeTab = document.getElementsByClassName("menu-icon")[0];
let menuTabsContent = document.getElementsByClassName("menu-tab-content");
let activeMenuTabContent = menuTabsContent[0];//document.getElementById("menu-tab-container").firstElementChild;

// init 
hideAllMenuContent();
setActiveMenuContent(activeMenuTabContent);
setActiveMenu(activeTab);
setMenuTabClickEvent();

function setMenuTabClickEvent() {
    for(let i=0; i<menuTabs.length; i++) {
        menuTabs[i].addEventListener("click", (event) => {
            // hide active tab content
            activeMenuTabContent.style.display = "none";
            // set current tab
            let tabContent = document.getElementById(event.target.hash.substr(1));
            setActiveMenuContent(tabContent);
            setActiveMenu(event.target);
        })
    }
}

function setActiveMenuContent(tabContent) {
    tabContent.style.display = "flex";
    activeMenuTabContent = tabContent;
}

function setActiveMenu(tab) {
    // remove current active menu style
    activeTab.classList.remove(CLASS_ACTIVE_MENU);
    // set current active menu style
    tab.classList.add(CLASS_ACTIVE_MENU);
    activeTab = tab;
}

function hideAllMenuContent() {
    for(let i=0; i<menuTabsContent.length; i++) {
        menuTabsContent[i].style.display = "none";
    }
}

export async function logout() {
    let url = "/logout";
    let options = {
        method: "POST"
    }
    
    try {
        let res = (await fetch(url, options)).json();
        if(res.isError) {
            throw new Error();
        }
        else {
            history.pushState(null, null, '');
            location.href = "/login";
        }
    }
    catch(err) {
        Notification.openNoti("Fail to log out");
    }
}
