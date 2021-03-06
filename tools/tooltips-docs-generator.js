const data = require("./graph-config-jsdoc");
const TOOLTIPS_MAX_WIDTH = 400;
const LIVE_DOCS_LINK = "https://goodguydaniel.com/react-d3-graph/docs/index.html";
const DOCS_LINK_MARKUP = `\
    <small>\
        for more details check the <a target="_blank" href="${LIVE_DOCS_LINK}">official documentation</a>\
    </small>\
`;

if (!data || !data.length || !data[0].params) {
    throw new Error("Invalid JSON provided from jsdoc parser");
}

/**
 * Parses a param and extracts its info
 * in a useful structure.
 * @param {Object} param param JSON from jsdoc.
 * An example of a param:
 * {
 *     "type": {
 *         "names": [
 *             "string",
 *             "function"
 *         ]
 *     },
 *     "optional": true,
 *     "defaultvalue": false,
 *     "description": "this is the (...)",
 *     "name": "node.labelProperty"
 * }
 * @returns {Object} the para formatted
 * information mapped by the param name.
 */
function getParamInfo(param) {
    const { type, optional, defaultvalue, description: rawDescription, name } = param;
    const types = type && type.names && type.names;
    const ftype = types && types.length ? types.join("|") : "*";

    // make images smaller so that they fit in the tooltip
    const description = rawDescription
        .replace(/width="(\d+)"/gi, "width='400'")
        .replace(/height="(\d+)"/gi, "height='200'");

    return {
        [name]: `\
            <h4>${name}</h4>\
            <b>type</b>: ${ftype} | <b>default value</b>: ${defaultvalue} | <b>optional</b>: ${optional}\
            <h5>Description</h5>\
            <div style="max-width: ${TOOLTIPS_MAX_WIDTH}px;">${description}</div>\
            ${DOCS_LINK_MARKUP}\
        `,
    };
}

/**
 * Removes JavaScript markdown blocks from the input text.
 * @param {string} s the code block from where we want
 * to remove the code block marks.
 * @returns {string} final text without javascript code blocks.
 */
function stripJsMdBlocks(s) {
    return s.replace(/```javascript(.*)```/gi, "");
}

const graphConfigElms = data[0].params.map(getParamInfo).reduce((acc, o) => ({ ...o, ...acc }), {});
const output = `\
/*eslint-disable*/\n\
export const tooltips = ${JSON.stringify(graphConfigElms, null, 2)};\
`;

console.log(stripJsMdBlocks(output));
