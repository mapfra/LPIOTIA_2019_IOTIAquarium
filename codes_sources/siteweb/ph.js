FusionCharts.ready(function() {
    var ccChart = new FusionCharts({
        type: 'hlineargauge',
        renderAt: 'chart-container',
        id: 'cs-linear-gauge',
        width: '400',
        height: '140',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            "theme": "fusion",
            "caption": "PH",
            "subcaption": "food.hsm.com",
            "captionFontColor": "#000000",
            "subcaptionFontBold": "0",
            "bgColor": "#ffffff",
            "showBorder": "0",
            "lowerLimit": "0",
            "upperLimit": "14",
            /*"numberSuffix": "%",*/
            "valueAbovePointer": "0",
            "showShadow": "0",
            "gaugeFillMix": "{light}",
            "valueBgColor": "#ffffff",
            "valueBgAlpha": "60",
            "valueFontColor": "#000000",
            "pointerBgColor": "#ffffff",
            "pointerBgAlpha": "50",
            "baseFontColor": "#ffffff"
          },
          "colorRange": {
            "color": [{
                "minValue": "0",
                "maxValue": "5",
                "label": "Acide",
                "code": "#c02d00"
              },
              {
                "minValue": "6",
                "maxValue": "8",
                "label": "Neutre",
                "code": "#f2c500"
              },
              {
                "minValue": "9",
                "maxValue": "14",
                "label": "Basique",
                "code": "#1aaf5d"
              }
            ]
          },
          "pointers": {
            "pointer": [{
              "value": "7"
            }]
          }
        },
        /*"events": {
          "rendered": function(evtObj, argObj) {
            var intervalVar = setInterval(function() {
              var prcnt = 7 + parseInt(Math.floor(Math.random() * 10), 10);
              FusionCharts.items["cs-linear-gauge"].feedData("value=" + prcnt);
            }, 5000);
          }
        }*/
      })
      .render();
  });
  