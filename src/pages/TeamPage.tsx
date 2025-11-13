import { Layout } from '@/components/layout/Layout';
import 경호 from '@/assets/team/경호.jpg';
import 승균 from '@/assets/team/승균.jpg';
import 민준 from '@/assets/team/민준.png';
import 석찬 from '@/assets/team/석찬.jpg';
import 승연 from '@/assets/team/승연.jpg';
import 경찬 from '@/assets/team/경찬.png';

export const TeamPage = () => {
  const teamMembers = [
    {
      name: '조경호',
      github: 'https://github.com/Alien-kh',
      photo: 경호,
    },
    {
      name: '박승균',
      github: 'https://github.com/parkdu7',
      photo: 승균,
    },
    {
      name: '김민준',
      github: 'https://github.com/Aristia0930',
      photo: 민준,
    },
    {
      name: '윤석찬',
      github: 'https://github.com/alsdal',
      photo: 석찬,
    },
    {
      name: '오승연',
      github: 'https://github.com/syeony',
      photo: 승연,
    },
    {
      name: '박경찬',
      github: 'https://github.com/chomuG',
      photo: 경찬
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-primary to-primary-600 text-white py-20">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Team ARFNI</h1>
            <p className="text-xl opacity-90">싸피마켓을 만든 팀을 소개합니다</p>
          </div>
        </div>

        {/* 팀 소개 섹션 */}
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <p className="text-2xl font-bold text-gray-700 leading-relaxed mb-4">
              ARFNI - "기존 인프라의 개념을 완전히 뒤집다"
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              싸피마켓은 <a href="https://arfni.duckdns.org/" target="_blank" rel="noopener noreferrer" className="font-bold text-primary">ARFNI</a> 활용하여 안정적이고 효율적인 배포 환경을 구축하여 제작되었습니다.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <a href="https://arfni.duckdns.org/" target="_blank" rel="noopener noreferrer" className="font-bold text-primary">ARFNI</a>는 기존의 어렵고 복잡한 인프라 구축을
              GUI 기반으로 쉽고 간편하게 만들어주는 배포 자동화 서비스입니다.
            </p>
          </div>

          {/* 팀원 소개 섹션 */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">팀원 소개</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
                >
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    {member.name}
                  </h3>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-primary hover:text-primary-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">GitHub</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* 연락처 섹션 */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">연락처</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">이메일</p>
                  <a
                    href="mailto:arfni201@googlegroups.com"
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    arfni201@googlegroups.com
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">GitHub Organization</p>
                  <a
                    href="https://github.com/Arfni/arfni-exe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Arfni/arfni-exe
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ARFNI Website</p>
                  <a
                    href="https://arfni.duckdns.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    arfni.duckdns.org
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
