import { Mean2tsPage } from './app.po';

describe('mean2ts App', function() {
  let page: Mean2tsPage;

  beforeEach(() => {
    page = new Mean2tsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
