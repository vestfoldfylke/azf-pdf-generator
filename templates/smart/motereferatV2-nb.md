---
definition: motereferatmal
language: nb
watermark: {{#if preview}} true {{else}} false {{/if}}
info:
  sector: {{ sector }}
  our-date: {{ isoDate meetingDate }}
  our-caseworker: {{ meetingResponsible }}
  our-reference: {{ meetingCaseNumber }}
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
{{#each attachments}}
- {{ fileName }}
{{/each}}
{{/if}}
---
{{/each}}
