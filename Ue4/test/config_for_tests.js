/** This module defines some parameters for all tests and is included as a config to tests
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 * @module test/config-for-tests
 * @type {Object}
 */

// Please change the test base URL if you have different server:port
module.exports.baseURL = 'http://localhost:3000/';

// some helper objects and function to be send to node ********************************************
module.exports.pinURL = module.exports.baseURL + 'pins';
module.exports.codes = {
    success: 200,
    created: 201,
    wrongrequest: 400,
    notfound: 404,
    wrongmethod: 405,
    cannotfulfill: 406,
    wrongmedia: 415,
    nocontent: 204
};

module.exports.pinCorrectMin = {
    title: "404, the story of a page not found",
    type: "video",
    src: "http://download.ted.com/talks/RennyGleeson_2012U-480p.mp4?apikey=489b859150fc58263f17110eeb44ed5fba4a3b22",
};

module.exports.pinCorrectMax = {
    title: "Social Media Active Monthly Users",
    description: "Taken from yourescapefrom9to5.com this informs about the Social Platforms with most active users.",
    type: "image",
    src: "http://yourescapefrom9to5.com/wp-content/uploads/2016/01/Social-Media-Monthly-Active-Users-for-2016-Infographic.jpg",
    views: 3992659,
    ranking: 12345
};
module.exports.pinIncorrectNumber = {
    title: "The importance of visuals",
    description: "kwikturnmedia has shown in this infographic how important visual content is for the brain.",
    type: "image",
    src: "https://www.toushenne.de/files/robertweller/img/infographics/visual-content-infographic.jpg",
    views: 1158984,
    ranking: -12
};
module.exports.pinIncorrectType = {
    title: "The OTHER importance of visuals",
    description: "kwikturnmedia has shown in this infographic how important visual content is for the brain.",
    type: "website and image",
    src: "https://www.toushenne.de/files/robertweller/img/infographics/visual-content-infographic.jpg",
    views: 1158984,
    ranking: 122
};

module.exports.pinCorrect3 = {
    title: "The 2017 future of web design",
    description: "Trends are well known changes that happen in all creative fields, and web design is no different. Born of experimentation and innovation, trends are the driving factors for change, which (for the most part) push an industry forward for the better.",
    type: "website",
    src: "https://www.zazzlemedia.co.uk/blog/digital-design-trends/#gref",
    views: 1108247,
    ranking: 44
};

module.exports.pinCorrect4 = {
    title: "Influence and Social Media",
    description: "",
    type: "image",
    src: "https://s-media-cache-ak0.pinimg.com/564x/fb/1d/9d/fb1d9d50b54063a9d8e5f9c95928d0f0.jpg",
    views: 1843221,
    ranking: 100
};