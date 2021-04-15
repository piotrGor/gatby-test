import React from 'react';
import ReactDOM from 'react-dom';
import XmlRenderer from 'xml-renderer';
const { DOMParser } = require('xmldom')
global.DOMParser = DOMParser

export class ContentRenderer {
    xr;
    constructor() {
        this.xr = new XmlRenderer();
        // block
        this.xr.register('self::richText', r => <div className="richt-text">{r.traverse()}</div>);
     



        this.xr.register('self::intro', r => <p className="intro">{r.traverse()}</p>);
        this.xr.register('self::teaser-text', r => r.traverse());
        this.xr.register('self::text', r => r.traverse());
        this.xr.register('self::subheadline-1', r => <h2 className="teaser-text">{r.traverse()}</h2>);
        this.xr.register('self::subheadline-2', r => <h3 className="teaser-text">{r.traverse()}</h3>);
        this.xr.register('self::subheadline-3', r => <h4 className="teaser-text">{r.traverse()}</h4>);
        this.xr.register('self::enumeration', r => <ol className="teaser-text">{r.traverse()}</ol>);
        this.xr.register('self::bullet-list', r => <ul className="teaser-text">{r.traverse()}</ul>);
        this.xr.register('self::item', r => <li>{r.traverse()}</li>);
        this.xr.register('self::paragraph', r => <p className="paragraph">{r.traverse()}</p>);
        
 

        // inline
        this.xr.register('self::bold', r => <b>{r.traverse()}</b>);
        this.xr.register('self::italic', r => <i>{r.traverse()}</i>);
        this.xr.register('self::bold-italic', r => <b><i>{r.traverse()}</i></b>);
        this.xr.register('self::link', r => {
            if (r.getNode().attributes.url) {
                return <a target="_blank" href={r.getNode().attributes.url.nodeValue}>{r.traverse()}</a>
            } else {
                return r.traverse();
            }
        });
        // text
        this.xr.register('self::text()', r => r.getNode().nodeValue);
        // element fall back
        this.xr.register('self::*', r => r.traverse());
    }
    render(xmlStr) {
        try {
            const node = new DOMParser().parseFromString(xmlStr, 'application/xml');
            return this.xr.node(node).traverse();
        } catch (e) {
            console.log('catch e', e)
            return (<div></div>);
        }
    }
}

