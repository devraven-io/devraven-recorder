import React, { Fragment } from "react"

const Highlighter = ({ highlighterBoundary }) => {

    if (!highlighterBoundary) {
        return <Fragment />
    }

    return <span className="highlighter"
        style={{ left: highlighterBoundary.left, top: highlighterBoundary.top, width: highlighterBoundary.width, height: highlighterBoundary.height }} />
}

export default Highlighter;