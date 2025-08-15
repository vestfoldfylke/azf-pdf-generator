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

**Beskrivelse**<br>
{{#if descriptionText}}
{{ descriptionText }}
{{else}}
Ingen beskrivelse
{{/if}}

{{#if decisionText}}
**{{itemType}}**<br>
{{ decisionText }}
{{/if}}

{{#if attachments}}
**Vedlegg**<br>
*Merk at vedlegg kan være dokumenter under arbeid*
{{#each attachments}}
- {{ fileName }}
{{/each}}
{{/if}}
---
{{/each}}
