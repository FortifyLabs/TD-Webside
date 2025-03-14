import nmap;

responses = {
  "start": "Anti Cheat is starting up...",
  "stop": "Anti Cheat is shutting down...",
  "nmap_info": "Use the command nmap to scan the network.",
  "help": "I'm a chatbot that can help you with Anti Cheat. You can ask me questions like 'what is nmap?' or 'how do I start Anti Cheat?'",
  "ssh Bruteforce": "SSH Bruteforce is a type of attack that tries to guess the password of an SSH server. Start a SSH Bruteforce attack by running the command 'ssh Bruteforce'.",
  "how do I start Anti Cheat?": "You can start Anti Cheat by running the command 'start'.",
  "what is Anti Cheat?": "Anti Cheat is a tool that can be used to detect and prevent cheating in online games.",
  "what is nmap?": "Nmap is a network scanning tool that can be used to discover hosts and services on a computer network.",
  "Checking all Acc Points": "That's a deep question! 42.",
  "commands": "Here are the commands you can use: start, stop, nmap, help, ssh Bruteforce, how do I start Anti Cheat?, what is Anti Cheat?, what is nmap?, Checking all Acc Points."
}
def begin():
    print("Chatbot: Hi! I'm a chatbot that can help you with Anti Cheat. You can ask me questions like 'what is nmap?' or 'how do I start Anti Cheat?'")
def start():
  print(responses["start"])
  print("Chatbot: Anti Cheat is now running...")
  print("Chatbot: Server is Online and Running")


begin()


def quest_nmap():
  if __name__ == "__main__":
      target = input("Enter target IP or hostname: ")
      ports = input("Enter ports (e.g., 22,80,443 or 1-65535): ")
      scan_target(target, ports)


while True:
    
    user_input = input("You: ")
    if user_input.lower() == "exit":
        print("Chatbot: Goodbye!")
        break
    if user_input in responses:
        print(f"Chatbot: {responses[user_input]}")
    else:
        print("Chatbot: I'm not sure I understand.")
    if user_input.lower() == "start anti cheat":
        start()
    if user_input.lower() == "nmap":
        quest_nmap()



#pip install python-nmap 
#nmap und python-nmap installiert sind


def scan_target(target, ports):
    scanner = nmap.PortScanner()
    print(f"Scanning {target} on ports {ports}...")
    
    scanner.scan(target, ports, arguments='-sS -T4')
    
    for host in scanner.all_hosts():
        print(f"\nHost: {host} ({scanner[host].hostname()})")
        print(f"State: {scanner[host].state()}")
        
        for proto in scanner[host].all_protocols():
            print(f"\nProtocol: {proto}")
            ports = scanner[host][proto].keys()
            
            for port in sorted(ports):
                print(f"Port: {port}\tState: {scanner[host][proto][port]['state']}")


#Asymetrische Verschlüsselung für die SSH Verbindung
#pip install paramiko
#ssh bruteforcer zusammen mit dem normalen bruteforcer implementieren
