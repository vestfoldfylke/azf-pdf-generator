---
definition: motereferatmal
language: nb
watermark: {{#if preview}} true {{else}} false {{/if}}
info:
  sector: {{ sector }}
  our-date: {{ isoDate meetingDate }}
  our-caseworker: {{ meetingResponsible }}
  paragraph: {{ paragraph }}
---

# {{ meetingTitle }} - {{ prettyDate meetingDate }}
---
{{#each meetingItems}}
## {{ inc @index }}. {{ title }}
{{#if itemResponsibleName}}
Saksansvarlig: {{itemResponsibleName}}<br>
{{/if}}
{{#if itemStatus}}
Status: {{itemStatus}}<br>
{{/if}}
{{#if itemType}}
Sakstype: {{itemType}}<br>
{{/if}}

### Beskrivelse
{{#if descriptionMd}}
{{ descriptionMd }}
{{else}}
Ingen beskrivelse
{{/if}}

{{#if decisionMd}}
### Beslutning
{{ decisionMd }}
{{/if}}

{{#if attachments}}
### Vedlegg<br>
{{#each attachments}}
- {{ fileName }}
{{/each}}
{{/if}}
---
{{/each}}
