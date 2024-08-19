"use client";

import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  return (
    <main>
      <section className=" w-full h-auto bg-secondary-700">
        <div className="h-[788px] w-full flex justify-center space-x-[483px] px-[219px] relative pb-[100px]">
          <Image src="/assets/images/about/aboutText1.svg" alt={"국내 여행의"} width={486} height={128} />
          <Image src="/assets/images/about/aboutText2.svg" alt={"새로운 바람"} width={486} height={128} />
        </div>
        <Image
          src="/assets/images/about/aboutTypo1.svg"
          alt={"3d타이포 몸체"}
          width={847}
          height={618}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pt-[250px] ml-[60px]"
        />
        <Image
          src="/assets/images/about/aboutTypo2.svg"
          alt={"3d타이포 몸체"}
          width={441}
          height={348}
          className="absolute z-50"
          style={{
            top: "140px",
            left: "572px",
          }}
        />
      </section>
      <section>
        <Image src="/assets/images/about/Rectangle1300.svg" alt={"Rectangle1300"} width={1920} height={12} />
        <Image src="/assets/images/about/Frame346.svg" alt={"Frame346.svg"} width={1920} height={352} />
        <Image src="/assets/images/about/Rectangle1300.svg" alt={"Rectangle1300"} width={1920} height={12} />
      </section>
      <section className="w-full h-auto bg-third-800 overflow-x-hidden">
        <div className="flex w-full">
          <Image src="/assets/images/about/Vector.svg" alt={"Vector"} width={960} height={105} />
          <Image src="/assets/images/about/Vector.svg" alt={"Vector"} width={960} height={105} />
        </div>
        <div className="ml-[241px] pt-[105px]">
          <div className="flex items-center space-x-4">
            <Image src="/assets/images/about/text1.svg" alt={"text1.svg"} width={259} height={24} />
            <Image src="/assets/images/about/Horang.svg" alt={"Horang.svg"} width={132} height={35} />
          </div>
          <div className="mt-[24px] w-[calc(259px+132px+16px)]" style={{ borderTop: "1px solid #B2A374" }}></div>
          <p className="mt-[24px] text-white text-[24px] font-normal">호랑과 함께 국내여행을 진행해 보세요</p>
        </div>
        <div className="mt-[194px] flex">
          <Image src="/assets/images/about/Vector(1).svg" alt={"Vector(1).svg"} width={259} height={118} />
          <div className="ml-[336px] flex gap-[12px] mt-[30px] ">
            <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
            <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
            <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
          </div>
        </div>
        <div className="ml-[241px] flex mt-[12px] gap-[12px] mb-[100px]">
          <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
          <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
          <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
          <div className="ml-auto mt-[220px]">
            <Image src="/assets/images/about/Vector(2).svg" alt={"Vector(2).svg"} width={295} height={92} />
          </div>
        </div>
        <div className="flex justify-between ml-[241px]">
          <div className="pt-[100px]">
            <div className="flex ">
              <Image src="/assets/images/about/aboutHorang.svg" alt={"aboutHorang.svg"} width={118} height={29} />
            </div>
            <div className="mt-[24px] w-[calc(259px+132px+16px)]" style={{ borderTop: "1px solid #B2A374" }}></div>
            <p
              className="mt-[12px] text-white text-[28px] font-bold"
              style={{ lineHeight: "35px", letterSpacing: "-0.6px" }}
            >
              호랑과 함께 국내여행을 진행해 보세요
            </p>
            <p
              className="mt-[12px] text-white text-[24px] font-normal"
              style={{ lineHeight: "35px", letterSpacing: "-0.6px" }}
            >
              여행지, 숙소, 음식점과 축제 및 행사 등 다양한&nbsp;
              <span className="font-black" style={{ color: "#4068F7" }}>
                국내 여행 정보 제공 플랫폼
              </span>
            </p>
            <p
              className="mt-[12px] text-white text-[24px] font-normal"
              style={{ lineHeight: "35px", letterSpacing: "-0.6px" }}
            >
              사용자의
              <span className="font-black" style={{ color: "#4068F7" }}>
                여행 MBTI 유형
              </span>
              을 나눠 사용자의 취향을 고려한&nbsp;
              <span className="font-black" style={{ color: "#4068F7" }}>
                맞춤형 추천 서비스 제공
              </span>
            </p>
            <p
              className="mt-[12px] text-white text-[24px] font-normal mb-[241px]"
              style={{ lineHeight: "35px", letterSpacing: "-0.6px" }}
            >
              호랑 여행객을 위한&nbsp;
              <span className="font-black" style={{ color: "#4068F7" }}>
                커뮤니티, 채팅 기능
              </span>
              을 통해 소통의 장 제공
            </p>
          </div>
          <div className="mr-[191px] pt-[100px]">
            <Image src="/assets/images/about/image1278.svg" alt={"image1278.svg"} width={560} height={409} />
          </div>
        </div>
        <div className="flex ml-[241px] pt-[100px] pr-[106px] mb-[100px]">
          <Image src="/assets/images/about/Frame351.svg" alt={"Frame351.svg"} width={452} height={468} />
          <div className="ml-[246px]">
            <p
              className="text-white text-[28px] font-bold mb-[24px]"
              style={{ lineHeight: "36px", letterSpacing: "-0.7px" }}
            >
              여행지 추천
            </p>
            <div className="w-[calc(364px)]" style={{ borderTop: "1px solid #B2A374" }}></div>
            <p
              className="text-white text-[28px] font-bold mb-[12px] pt-[24px]"
              style={{
                lineHeight: "36px",
                letterSpacing: "-0.7px",
              }}
            >
              새로운 여행의 바람
            </p>
            <p
              className="text-white text-[24px] font-normal"
              style={{
                lineHeight: "35px",
                letterSpacing: "-0.6px",
                // WebkitTextStrokeWidth: "1px",
                // WebkitTextStrokeColor: "#000",
              }}
            >
              가볼 만한 여행지, 맛집, 놀거리, 축제 및 행사 등 모든 것을 한 곳에서 찾을 수 있습니다. 지역별 구분과 검색
              기능을 통해 쉽게 원하는 정보를 찾아보세요. 여러분의 여행 계획을 보다 알차게 만들어줄 다양한 여행지들을
              만나보세요! 호랑은 개인 취향에 맞는 여행 및 먹거리를 추천하는 정보 제공 플랫폼입니다.
            </p>
          </div>
        </div>
        <div className="flex ml-[241px] pt-[100px]">
          <div>
            <p
              className="text-white text-[28px] font-bold mb-[24px]"
              style={{ lineHeight: "36px", letterSpacing: "-0.7px" }}
            >
              내 근처 여행지
            </p>
            <div className="w-[calc(364px)]" style={{ borderTop: "1px solid #B2A374" }}></div>
            <p
              className="text-white text-[24px] font-bold mt-[24px]"
              style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}
            >
              지금 내 주변에서 숨겨진 핫플레이스를 찾아보세요! 🌟
            </p>
            <p className="text-white text-[24px] font-normal" style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}>
              GPS로 내 위치를 확인하고, 50km 이내의 멋진 관광지를 탐험해보세요!
            </p>
            <p className="text-white text-[24px] font-normal" style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}>
              지도를 마음껏 탐색하며 새로운 여행지를 발견하고, 관광지 마커를 클릭하면 그곳의 매력적인 정보를 한눈에
              확인할 수 있습니다.
            </p>
            <p
              className="text-white text-[24px] font-normal mb-[20px]"
              style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}
            >
              어디에 숨겨져 있는지 모르는 매력적인 핫플레이스들을 발견하고, 내 주변에서 새로운 모험을 시작해보세요! ✨
            </p>
          </div>
        </div>
        <div className="ml-[241px] mb-[24px]">
          <div className="mb-[24px]">
            <Image src="/assets/images/about/Rectangle1324.svg" alt={"Rectangle1324.svg"} width={1438} height={520} />
          </div>

          <div className="mb-[100px]">
            <Link href="/location">
              <button className="w-[562px] h-[54px] bg-primary-400 flex items-center justify-center text-white text-lg  rounded-3xl">
                내 근처 여행지 찾아보기
              </button>
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-secondary-700">
        <div className=" ml-[241px] pt-[100px] overflow-hidden">
          <p
            className="text-white text-[28px] font-bold mb-[24px]"
            style={{ lineHeight: "36px", letterSpacing: "-0.7px" }}
          >
            나만의 여행
          </p>
          <div className="w-[calc(364px)]" style={{ borderTop: "1px solid #B2A374" }}></div>
          <p
            className="text-white text-[24px] font-bold mt-[24px] mb-[10px]"
            style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}
          >
            호랑과 함께 국내여행을 진행해 보세요
          </p>
          <p className="text-white text-[24px] font-normal " style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}>
            우리나라 국토가 호랑이 모양을 띄고 있다는 말을 들어보셨는지요?
          </p>
          <p className="text-white text-[24px] font-normal" style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}>
            국내 여행 웹 서비스 호랑은 나만의 특별한 국내 여행을 위해 나만의 호랑 MBTI 유형
          </p>
          <p className="text-white text-[24px] font-normal" style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}>
            을 간단한 설문과 이미지로 정의해드리며, 해당 유형 에 따른 여행지를 랜덤하게 보
          </p>
          <p className="text-white text-[24px] font-normal" style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}>
            여드려요. 가고 싶은 여행지도 좋아요를 눌러서 나의 공간에 저장해보세요!
          </p>
          <div className="flex pb-[96px] gap-[12px]">
            <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
            <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
            <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
            <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
            <Image src="/assets/images/about/Frame336.svg" alt={"Frame336.svg"} width={354} height={300} />
          </div>
        </div>
      </section>
      <section className="bg-third-800">
        <div className=" ml-[241px] pt-[100px]">
          <p
            className="text-white text-[28px] font-bold mb-[24px]"
            style={{ lineHeight: "36px", letterSpacing: "-0.7px" }}
          >
            대화 하기
          </p>
          <div className="w-[calc(364px)]" style={{ borderTop: "1px solid #B2A374" }}></div>
          <p
            className="text-white text-[28px] font-bold mt-[24px] mb-[12px]"
            style={{ lineHeight: "36px", letterSpacing: "-0.7px" }}
          >
            호랑에 가입한 모든 유저와 실시간 대화를 통해 다양한 정보를 얻어보세요
          </p>
          <p className="text-white text-[24px] font-normal" style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}>
            여행지 추천, 맛집, 숨겨진 명소 등 유용한 팁을 서로 공유하며 여러분의 여행을 더욱 특별하게 만들어 줄
            것입니다.
          </p>
          <p
            className="text-white text-[24px] font-normal pb-[200px]"
            style={{ lineHeight: "30px", letterSpacing: "-0.6px" }}
          >
            다른 여행자들 의 생생한 경험담을 통해 새로운 아이디어를 얻고, 더 알찬 여행 계획을 세워보세요. 호랑과 함께
            즐거운 여행을 만끽하세요!
          </p>
        </div>
        <div>
          <Image src="/assets/images/about/Frame369.svg" alt={"Frame369.svg"} width={1920} height={447} />
        </div>
      </section>
      <section>
        <div>
          <Image src="/assets/images/about/Frame367.svg" alt={"Frame367.svg"} width={1920} height={786} />
        </div>
        <div className="mb-[667px] mt-[34px] flex items-center justify-center">
          <Link href="/community">
            <button className="w-[562px] h-[54px] bg-primary-400 flex items-center justify-center text-white text-lg rounded-3xl">
              커뮤니티 바로가기
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
