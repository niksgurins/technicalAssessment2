const fetchBlogData = async () => {
    let blogData;
    await fetch("https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json")
        .then(data => data.json())
        .then(data => blogData = data)
        .catch(err => console.log(err));

    return blogData;
}

const getGroupsStringFromPost = (postGroups) => {
    return postGroups.map((group, index) => {
        const groupName = group.name.toUpperCase();
        if (postGroups.length <= 1)
            return `${groupName}`;
        else {
            if (index === postGroups.length-1)
                return `${groupName}`;
            else if (index === postGroups.length-2)
                return `${groupName} & `;
            else
                return `${groupName}, `;
        }
    }).join(" ");
}

const getCategoriesStringFromPost = (postCategories) => {
    return postCategories.map((category, index) => {
        const categoryName = category.name;
        if (postCategories.length <= 1)
            return `${categoryName}`;
        else {
            if (index === postCategories.length-1)
                return `${categoryName}`;
            else
                return `${categoryName}, `;
        }
    }).join(" ");
}

const createBlogPostElement = (post) => {
    // Create all the necessary elements to make a blog post card and populate them with data
    const element = document.createElement("div");
    element.classList.add("p-card", "col-4");

    const groups = document.createElement("h7");
    groups.innerHTML = getGroupsStringFromPost(post._embedded["wp:term"][3]);
    
    const img = document.createElement("img");
    img.src = post.featured_media;

    const title = document.createElement("h3");
    const titleLink = document.createElement("a");
    titleLink.href = post.link;
    title.innerHTML = post.title.rendered;

    const p = document.createElement("p");
    const i = document.createElement("i");
    i.innerHTML = `By <a href="${post._embedded.author[0].link}">${post._embedded.author[0].name}</a> on ${new Date(post.date).toDateString().slice(4)}`;
    
    const categories = document.createElement("p");
    categories.innerHTML = getCategoriesStringFromPost(post._embedded["wp:term"][0]);

    const hr1 = document.createElement("hr");
    hr1.classList.add("p-hr");
    const hr2 = document.createElement("hr");
    hr2.classList.add("p-hr");

    // Append all child elements to card
    element.appendChild(groups);
    element.appendChild(hr1);
    element.appendChild(img);
    titleLink.appendChild(title);
    element.appendChild(titleLink);
    p.appendChild(i);
    element.appendChild(p);
    element.appendChild(hr2);
    element.appendChild(categories);

    // Return card element
    return element;
}

const renderBlogPosts = async () => {
    await fetchBlogData().then(data => {
        let archiveGrid = document.getElementById("archive");
        data.forEach(post => {
            archiveGrid.appendChild(createBlogPostElement(post));
        });
    });
}

const main = () => {
    renderBlogPosts();
}

main();