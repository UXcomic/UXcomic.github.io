import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Post } from './post'
import { PostContent } from '../../models/post-content'

const fakePost = {
  id: '16e5d164-78d8-80bc-911c-e46d1955dd98',
  cover: null,
  title: 'Figma UI term vs CSS term',
  slug: 'figma-ui-term-vs-css-term',
  createdDate: new Date('2025-01-01T04:19:00.000Z'),
  category: { id: 'c1', name: 'Technical', slug: 'technical', icon: '🕹️' },
  tag: { id: 't1', name: 'UI relevant', slug: 'ui-relevant', order: 1 },
  content: [],
} as PostContent

const fakeEmbedPost = {
  ...fakePost,
  title: 'Test',
  slug: 'test',
  cover: {
    type: 'image',
    image: {
      caption: [],
      type: 'file',
      file: { url: 'https://res.cloudinary.com/dpzknshvi/image/upload/uxcomic-imgs/test.png' },
    },
  },
} as PostContent

describe('Post', () => {
  let component: Post
  let fixture: ComponentFixture<Post>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Post],
    }).compileComponents()

    fixture = TestBed.createComponent(Post)
    component = fixture.componentInstance
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  describe('top header', () => {
    beforeEach(() => {
      ;(component as any).post = fakePost
      fixture.detectChanges()
    })

    it('renders a close link to the blog route of the post category and tag', () => {
      const header = fixture.nativeElement.querySelector('header')
      expect(header).toBeTruthy()

      const closeLink = header.querySelector('a[aria-label="Close article"]')
      expect(closeLink).toBeTruthy()
      expect(closeLink.getAttribute('href')).toBe('/blog/technical/ui-relevant')
    })

    it('keeps the top header visible when the post has an embed (fullscreen mode)', () => {
      ;(component as any).hasEmbed = true
      fixture.detectChanges()

      const header = fixture.nativeElement.querySelector('header')
      expect(header).toBeTruthy()
    })
  })

  describe('embed title and thumbnail', () => {
    it('renders the post thumbnail and title when the post has an embed and a cover', () => {
      ;(component as any).post = fakeEmbedPost
      ;(component as any).hasEmbed = true
      fixture.detectChanges()

      const header = fixture.nativeElement.querySelector('header')
      const img = header.querySelector('img')
      const title = header.querySelector('.post__embed-title')

      expect(img).toBeTruthy()
      expect(img.getAttribute('src')).toBe(fakeEmbedPost.cover.image.file.url)
      expect(img.getAttribute('width')).toBe('40')
      expect(img.getAttribute('height')).toBe('40')
      expect(title).toBeTruthy()
      expect(title.textContent).toContain('Test')
    })

    it('renders only the title when the post has an embed but no cover', () => {
      ;(component as any).post = fakePost
      ;(component as any).hasEmbed = true
      fixture.detectChanges()

      const header = fixture.nativeElement.querySelector('header')
      const img = header.querySelector('img')
      const title = header.querySelector('.post__embed-title')

      expect(img).toBeFalsy()
      expect(title).toBeTruthy()
      expect(title.textContent).toContain('Figma UI term vs CSS term')
    })

    it('does not render the title or thumbnail when the post has no embed', () => {
      ;(component as any).post = fakeEmbedPost
      ;(component as any).hasEmbed = false
      fixture.detectChanges()

      const header = fixture.nativeElement.querySelector('header')
      const img = header.querySelector('img')
      const title = header.querySelector('.post__embed-title')

      expect(img).toBeFalsy()
      expect(title).toBeFalsy()
    })
  })
})
