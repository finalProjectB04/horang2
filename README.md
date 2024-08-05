# 🐯Horang

- ✅
- ✅

<br/><br/>

## 팀원

|                                   안종현                                    |                                   서예은                                   |                                    양대우                                    |                                 김지환                                 |                                 김운성                                 |                                                             이지원                                                              |
| :-------------------------------------------------------------------------: | :------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | :--------------------------------------------------------------------: | :--------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://avatars.githubusercontent.com/Ahnjonghyun87" width="200"> | <img src="https://avatars.githubusercontent.com/yeeunseo-dev" width="200"> | <img src="https://avatars.githubusercontent.com/DAEWOOYANG0310" width="200"> | <img src="https://avatars.githubusercontent.com/RingKim1" width="200"> | <img src="https://avatars.githubusercontent.com/host2024" width="200"> | <img src="https://crjcsxutfsroqsqumefz.supabase.co/storage/v1/object/public/profiles/public/horang_typography.png" width="200"> |
|                                    리더                                     |                                   부리더                                   |                                     팀원                                     |                                  팀원                                  |                                  팀원                                  |                                                            디자이너                                                             |
|              [Ahnjonghyun87](https://github.com/Ahnjonghyun87)              |              [yeeunseo-dev](https://github.com/yeeunseo-dev)               |             [DAEWOOYANG0310](https://github.com/DAEWOOYANG0310)              |                [RingKim1](https://github.com/RingKim1)                 |                [host2024](https://github.com/host2024)                 |                                                           [이지원]()                                                            |

<br/><br/>

## 프로젝트 진행 기간

- 2024.07.15 ~ 2024.08.22

<br/><br/>

## 🛠️개발 환경

<br/><br/>

## 상세설명

<br/><br/>

## 링크

- 🔗[Team Notion](https://www.notion.so/teamsparta/B_4-366aa6b8804f48f6b39d982da0ea084c)

## 프로젝트 폴더구조

public
│  └─assets
│      ├─fonts
│      │  │  pretendard.css
│      │  │
│      │  └─woff
│      │          Pretendard-Black.woff
│      │          Pretendard-Bold.woff
│      │          Pretendard-ExtraBold.woff
│      │          Pretendard-ExtraLight.woff
│      │          Pretendard-Light.woff
│      │          Pretendard-Medium.woff
│      │          Pretendard-Regular.woff
│      │          Pretendard-SemiBold.woff
│      │          Pretendard-Thin.woff
│      │
│      └─images
│          │  arrow.svg
│          │  back.svg
│          │  banner.jpg
│          │  bottom_deco.svg
│          │  community.png
│          │  defaultLikeIcon.png
│          │  detailpageMarker.png
│          │  ex3.png
│          │  ex4.png
│          │  ex5.png
│          │  ex6.png
│          │  foot.png
│          │  kakaoShare.png
│          │  linkUrl.png
│          │  loading.png
│          │  logo.svg
│          │  marker.svg
│          │  my_location.svg
│          │  newdetail.png
│          │  next.svg
│          │  null_image.svg
│          │  profile_ex.png
│          │  selected_marker.svg
│          │  send.png
│          │  shareModal.svg
│          │  smallMaker.png
│          │  star.png
│          │  successLikeIcon.png
│          │  Vector.png
│          │
│          ├─backgrounds
│          │      backgrounds.png
│          │
│          ├─controlImages
│          │      festival.png
│          │      hotel.png
│          │      leports.png
│          │      restaurants.png
│          │      travel.png
│          │
│          ├─header
│          │      header.png
│          │
│          ├─korea
│          │      korea1.png
│          │      korea2.jpg
│          │      korea3.jpg
│          │      korea4.jpg
│          │      korea5.jpg
│          │      korea6.jpg
│          │      korea7.jpg
│          │      korea8.jpg
│          │
│          └─login_logo
│                  google_logo.png
│                  kakao_logo.png
│
├─src
│  │  atoms.ts
│  │
│  ├─actions
│  │      chatActions.ts
│  │
│  ├─app
│  │  │  error.tsx
│  │  │  globals.css
│  │  │  layout.tsx
│  │  │  loading.tsx
│  │  │  not-found.tsx
│  │  │  page.tsx
│  │  │
│  │  ├─(detail)
│  │  │  ├─festival
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─hotel
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─leports
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─restaurant
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─travel
│  │  │          page.tsx
│  │  │
│  │  ├─(main)
│  │  │  ├─chat
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─detail
│  │  │  │  └─[contentId]
│  │  │  │          page.tsx
│  │  │  │
│  │  │  ├─intro
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─location
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─mypage
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─travelMbti
│  │  │      │  page.tsx
│  │  │      │  question.ts
│  │  │      │
│  │  │      ├─result
│  │  │      │  │  page.tsx
│  │  │      │  │  results.ts
│  │  │      │  │
│  │  │      │  └─[type]
│  │  │      │          page.tsx
│  │  │      │
│  │  │      └─survey
│  │  │              page.tsx
│  │  │
│  │  ├─(post)
│  │  │  ├─community
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─postDetail
│  │  │  │  └─[id]
│  │  │  │          page.tsx
│  │  │  │
│  │  │  └─writing
│  │  │          page.tsx
│  │  │
│  │  ├─(users)
│  │  │  ├─signin
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─signup
│  │  │          page.tsx
│  │  │
│  │  └─api
│  │      ├─(mypage)
│  │      │  ├─filterlikes
│  │      │  │      route.ts
│  │      │  │
│  │      │  └─likes
│  │      │          route.ts
│  │      │
│  │      ├─detail
│  │      │  └─[contentId]
│  │      │          route.ts
│  │      │
│  │      ├─login
│  │      │      route.ts
│  │      │
│  │      └─main
│  │          └─tourism
│  │              │  route.ts
│  │              │
│  │              ├─festival
│  │              │      route.ts
│  │              │
│  │              ├─leports
│  │              │      route.ts
│  │              │
│  │              └─travel
│  │                      route.ts
│  │
│  ├─components
│  │  ├─chat
│  │  │      ChatList.tsx
│  │  │      ChatScreen.tsx
│  │  │      Message.tsx
│  │  │      Person.tsx
│  │  │
│  │  ├─common
│  │  │  │  Advertisement.tsx
│  │  │  │  button.tsx
│  │  │  │  ListTitle.tsx
│  │  │  │  Loading.tsx
│  │  │  │  MainListTitle.tsx
│  │  │  │  Modal.tsx
│  │  │  │  Tab.tsx
│  │  │  │
│  │  │  ├─comments
│  │  │  │      AddComment.tsx
│  │  │  │      AddReply.tsx
│  │  │  │      CommentItem.tsx
│  │  │  │      CommentList.tsx
│  │  │  │      CommentSection.tsx
│  │  │  │      index.ts
│  │  │  │      ReplyItem.tsx
│  │  │  │
│  │  │  ├─Header
│  │  │  │      AuthButtons.tsx
│  │  │  │      Header.tsx
│  │  │  │      index.ts
│  │  │  │      Logo.tsx
│  │  │  │      Nav.tsx
│  │  │  │
│  │  │  ├─loginbutton
│  │  │  │  ├─googleLoginbutton
│  │  │  │  │      GoogleLoginButton.tsx
│  │  │  │  │      index.ts
│  │  │  │  │
│  │  │  │  └─kakaologin
│  │  │  │          index.ts
│  │  │  │          KakaoLoginButton.tsx
│  │  │  │
│  │  │  └─userspage
│  │  │      │  SocialLoginButtons.tsx
│  │  │      │
│  │  │      ├─signinpage
│  │  │      │      EmailInput.tsx
│  │  │      │      LoginButton.tsx
│  │  │      │      PasswordInput.tsx
│  │  │      │      SignInLink.tsx
│  │  │      │
│  │  │      └─signuppage
│  │  │              ProfileImage.tsx
│  │  │              SignInLink.tsx
│  │  │              SignUpForm.tsx
│  │  │
│  │  ├─detailpage
│  │  │      ContentDetail.tsx
│  │  │      ContentOverview.tsx
│  │  │      DetailPageAddComment.tsx
│  │  │      DetailPageCommentList.tsx
│  │  │      DetailPageLikeButton.tsx
│  │  │      DetailPagePagination.tsx
│  │  │      DetailPageSwiper.tsx
│  │  │      FloatingButton.tsx
│  │  │      KakaoMap.tsx
│  │  │      KakaoShareButton.tsx
│  │  │      LinkUrlButton.tsx
│  │  │      ShareModal.tsx
│  │  │
│  │  ├─location
│  │  │      LocationModal.tsx
│  │  │      Map.tsx
│  │  │
│  │  ├─main
│  │  │  │  Control.tsx
│  │  │  │  Festival.tsx
│  │  │  │  Leports.tsx
│  │  │  │  Travel.tsx
│  │  │  │
│  │  │  ├─image
│  │  │  │      MainImage.tsx
│  │  │  │      MidImage.tsx
│  │  │  │
│  │  │  └─swiper
│  │  │          MainTravelCard.tsx
│  │  │          TravelSlider.tsx
│  │  │
│  │  ├─maindetail
│  │  │      DetailTitle.tsx
│  │  │      ScrollToTopButton.tsx
│  │  │      SearchBar.tsx
│  │  │      SearchBarButton.tsx
│  │  │      TourismList.tsx
│  │  │      TravelCard.tsx
│  │  │
│  │  ├─mypage
│  │  │  ├─community
│  │  │  │      Community.tsx
│  │  │  │      LikePost.tsx
│  │  │  │      MyPost.tsx
│  │  │  │
│  │  │  ├─profile
│  │  │  │      Profile.tsx
│  │  │  │      ProfileCarousel.tsx
│  │  │  │      ProfileManagement.tsx
│  │  │  │
│  │  │  └─wishlist
│  │  │          MyPageCarousel.module.css
│  │  │          MyPageCarousel.tsx
│  │  │          WishList.tsx
│  │  │
│  │  ├─posting
│  │  │  ├─delete
│  │  │  │      route.ts
│  │  │  │
│  │  │  ├─image
│  │  │  │      CommunityImage.tsx
│  │  │  │
│  │  │  ├─insert
│  │  │  │      route.ts
│  │  │  │
│  │  │  ├─select
│  │  │  │      route.ts
│  │  │  │
│  │  │  └─update
│  │  │          route.ts
│  │  │
│  │  ├─SignupPage
│  │  │  └─SelectArea
│  │  │          areaData.ts
│  │  │          index.ts
│  │  │          SelectArea.tsx
│  │  │
│  │  └─travelMbti
│  │          TravelMbtiQuest.tsx
│  │
│  ├─hooks
│  │  │  useAuth.ts
│  │  │  useTouristSpots.ts
│  │  │
│  │  └─detailpage
│  │          useContentId.ts
│  │          useContentItem.ts
│  │          useSessionData.ts
│  │
│  ├─provider
│  │      QueryProvider.tsx
│  │      RecoilProvider.tsx
│  │
│  ├─types
│  │      Comments.types.ts
│  │      ContentItem.type.ts
│  │      global.d.ts
│  │      kakao-maps.d.ts
│  │      Likes.types.ts
│  │      Main.ts
│  │      Post.types.ts
│  │      Post_comments.types.ts
│  │      Post_likes.types.ts
│  │      supabase.ts
│  │      User.types.ts
│  │
│  ├─utils
│  │  │  auth.ts
│  │  │  logoutUser.ts
│  │  │  random.ts
│  │  │
│  │  ├─axios
│  │  │      axios.ts
│  │  │
│  │  ├─detailpage
│  │  │      StringUtils.ts
│  │  │
│  │  └─supabase
│  │      │  client.ts
│  │      │  server.ts
│  │      │  serverAdmin.ts
│  │      │
│  │      └─.temp
│  └─zustand
│          locationStore.ts
│          modalStore.ts
│          userStore.ts
│
└─supabase
    │  .gitignore
    │  config.toml
    │  seed.sql
    │
    └─.temp
            cli-latest
