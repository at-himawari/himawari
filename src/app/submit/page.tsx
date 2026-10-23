import styles from "../../views/index/HomePage.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SubmissionForm from "./SubmissionForm";
import { createPageMetadata } from "../../utils/seo";

export const metadata = createPageMetadata({ title: "投稿・お問い合わせ", description: "ネタ投稿、サイトへのご意見、業務委託のご相談を受け付けています。", path: "/submit" });

/** 投稿専用ページを表示する。 */
export default function Page() {
  return <>
    <Header />
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900" data-disable-rubyful="true">
    <div className="mx-auto max-w-2xl">
      <div className={`${styles.heroHeading} mx-auto text-center`}>
        <p className={styles.heroTitle}>
          <span className={styles.heroTitleLine}>
            <span className={styles.heroTitleRed}>ワ</span>ク
            <span className={styles.heroTitleBlue}>ワ</span>ク
            <span className={styles.heroTitleGreen}>ラ</span>ボ
            <span className={styles.heroTitlePlus}>＋</span>
          </span>
        </p>
        <p className={styles.heroEyebrow}>Himawari Project</p>
      </div>
      <h1 className="mt-8 text-3xl font-bold">投稿・お問い合わせ</h1>
      <p className="mt-4 leading-7 text-slate-600">ネタのご提案、サイトへのご意見、お仕事のご相談をお寄せください。</p>
      <SubmissionForm />
    </div>
    </main>
    <Footer />
  </>;
}
