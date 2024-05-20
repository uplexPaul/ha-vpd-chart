// Set version for the card
window.vpdChartVersion = "1.2.4";

import {methods} from './methods.js';
import {chart} from './chart.js';
import {bar} from './bar.js';
import {ghostmap} from './ghostmap.js';
import { HaVpdChartEditor } from './ha-vpd-chart-editor.js';

class HaVpdChart extends HTMLElement {
    _hass = {};

    static get properties() {
        return {
            sensors: {type: Array},
            min_temperature: {type: Number},
            max_temperature: {type: Number},
            min_humidity: {type: Number},
            max_humidity: {type: Number},
            min_height: {type: Number},
            vpd_phases: {type: Array},
            air_text: {type: String},
            rh_text: {type: String},
            kpa_text: {type: String},
            enable_tooltip: {type: Boolean},
            is_bar_view: {type: Boolean},
            enable_axes: {type: Boolean},
            enable_ghostmap: {type: Boolean},
            enable_triangle: {type: Boolean},
        };
    }
    static getConfigElement() {
        return document.createElement("ha-vpd-chart-editor");
    }
    constructor() {
        super();
        this.vpd_phases = [
            {upper: 0, className: 'gray-danger-zone'},
            {lower: 0, upper: 0.4, className: 'under-transpiration'},
            {lower: 0.4, upper: 0.8, className: 'early-veg'},
            {lower: 0.8, upper: 1.2, className: 'late-veg'},
            {lower: 1.2, upper: 1.6, className: 'mid-late-flower'},
            {lower: 1.6, className: 'danger-zone'},
        ];
        this.sensors = [];
        this.is_bar_view = false;
        this.min_temperature = 5;
        this.max_temperature = 35;
        this.min_humidity = 10;
        this.max_humidity = 90;
        this.min_height = 200;
        this.steps_temperature = .1;
        this.steps_humidity = .1;
        this.enable_tooltip = true;
        this.air_text = "Air";
        this.rh_text = "RH";
        this.kpa_text = "kPa";
        this.enable_axes = true;
        this.enable_ghostmap = true;
        this.enable_triangle = false;
        this.updateRunning = false;
    }

    set hass(hass) {
        this._hass = hass;
        this.is_bar_view ? this.buildBarChart() : this.buildChart();
    }
    // if config updated
    setConfig(config) {
        this.config = config;
        if (!config.sensors) {
            throw new Error('You need to define sensors');
        }

        const configKeys = [
            'vpd_phases', 'sensors', 'air_text', 'rh_text', 'kpa_text', 'min_temperature',
            'max_temperature', 'min_humidity', 'max_humidity', 'min_height',
            'is_bar_view', 'enable_axes', 'enable_ghostmap', 'enable_triangle',
            'enable_tooltip'
        ];

        configKeys.forEach(key => {
            if (key in config) {
                this[key] = config[key];
            }
        });
    }
}

Object.assign(HaVpdChart.prototype, methods);
Object.assign(HaVpdChart.prototype, chart);
Object.assign(HaVpdChart.prototype, bar);
Object.assign(HaVpdChart.prototype, ghostmap);

customElements.define('ha-vpd-chart', HaVpdChart);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "ha-vpd-chart",
    name: "Home Assistant VPD Chart",
    preview: false, // Optional - defaults to false
    description: "A custom card to display VPD values in a table",
    documentationURL: "https://github.com/mentalilll/ha-vpd-chart", // Adds a help link in the frontend card editor
});
console.groupCollapsed(`%c HA-VPD-CHART v${window.vpdChartVersion} Installed`, "color: green; background: black; font-weight: bold;");
console.log('Readme: ', 'https://github.com/mentalilll/ha-vpd-chart');
console.groupEnd();
