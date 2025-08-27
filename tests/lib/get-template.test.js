const getTemplate = require('../../lib/get-template')

describe('Get template', () => {
  it('throws when system isn\'t found', async () => {
    await expect(getTemplate('not-found', 'not-found'))
      .rejects
      .toThrow('Template not found!')
  })

  it('throws when template isn\'t found', async () => {
    await expect(getTemplate('minelev', 'not-found'))
      .rejects
      .toThrow('Template not found!')
  })

  it('fallback to \'nb\' when template for language isn\'t found', async () => {
    await expect(getTemplate('minelev', 'varsel/fag', 'en'))
      .resolves
      .toContain('language: nb')
  })

  it('returns template', async () => {
    await expect(getTemplate('minelev', 'varsel/fag'))
      .resolves
      .toContain('definition: brevmal')
  })
})
